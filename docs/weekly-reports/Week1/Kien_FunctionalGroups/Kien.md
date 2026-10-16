# Functional Groups

<!-- EXTENDED: Tiêu đề đổi từ "3.3. Nine Functional Groups" → "Functional Groups" để phản ánh số lượng group đã tăng lên 11 -->

**Project:** DineVina – Smart Restaurant Reservation and Event Booking System (Group 8)  
**Author:** Nguyen Trung Kien (24127068), Backend Engineer  
**Planned stack:** React with TypeScript, FastAPI, PostgreSQL, Docker Compose  

> Everything below is a plan; the repository currently has only a health endpoint.

---

## Introduction

DineVina serves three actors: **Customer**, **Restaurant Partner**, and **Administrator**. The nine groups cover the journey from account creation to a confirmed table or an event request. Payment processing and restaurant accounting are out of scope, and no native mobile application is included.

---

## Overview

| # | Functional Group | Main Actors | Stage |
|---|-----------------|-------------|-------|
| 1 | Accounts and profiles | Customer, Partner, Admin | Release 1 |
| 2 | Restaurant onboarding | Partner, Admin | Release 1 |
| 3 | Restaurant discovery | Customer | Release 1 |
| 4 | Menus | Partner, Customer | Release 1 |
| 5 | Table reservations | Customer, Partner | Release 1 |
| 6 | Event booking | Customer, Partner | Release 2 |
| 7 | Availability and partner dashboard | Partner | Release 1 (basic), Release 2 (full) |
| 8 | Promotions and editorial | Partner, Admin, Customer | Release 2 |
| 9 | Intelligent assistance | Customer, Admin | Release 3 |
| 10 | Notifications | Customer, Partner | Release 1 |
| 11 | Ratings and reviews | Customer, Admin | Release 2 |
| — | Cancellation policy | Customer, Partner | Release 1 (rules only) |

<!-- ADDED: Rows 10, 11, and Cancellation Policy added to Overview table -->

### Group Dependencies

<!-- EXTENDED: Thêm nodes G10, G11 + các cạnh G5→G10, G6→G10, G5→G11 vào dependency diagram -->

```mermaid
flowchart TD
    G1["① Accounts & Profiles"]
    G2["② Restaurant Onboarding"]
    G3["③ Restaurant Discovery"]
    G4["④ Menus"]
    G5["⑤ Table Reservations"]
    G6["⑥ Event Booking"]
    G7["⑦ Availability & Dashboard"]
    G8["⑧ Promotions & Editorial"]
    G9["⑨ Intelligent Assistance"]
    G10["⑩ Notifications"]
    G11["⑪ Ratings & Reviews"]

    G1 --> G2
    G1 --> G3
    G1 --> G4
    G1 --> G5
    G1 --> G6
    G1 --> G7
    G1 --> G8
    G1 --> G9

    G2 --> G3
    G2 --> G4
    G2 --> G5
    G2 --> G6
    G2 --> G9

    G7 --> G5

    G3 --> G9
    G4 --> G9

    G5 --> G10
    G6 --> G10
    G5 --> G11
```

> **Conventions for proposed APIs:** Endpoints are proposals to confirm with the frontend. Every protected endpoint checks role and ownership. All errors use one shared format. List endpoints are paginated.

---

## 1. Accounts and Profiles

**Purpose:** Identify every user and keep customer actions separate from restaurant management and administration.

### Main Functions

- Register, sign in, sign out, and reset a forgotten password by email.
- View and edit profile: name, phone, avatar; partners also keep a contact person.
- Optional customer preferences (cuisine, area, price, usual party size), stored with consent and reused by group 9.
- Change password; delete account on request.

### Proposed API

```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/password-reset
GET    /me
PATCH  /me
DELETE /me
GET    /me/preferences
PUT    /me/preferences
```

### Data Schema

| Table | Columns |
|-------|---------|
| `users` | `id`, `email` (unique), `password_hash`, `role` (customer / partner / admin), `status`, `created_at` |
| `profiles` | `user_id`, `full_name`, `phone`, `avatar_url` |
| `preferences` | `user_id`, `cuisines`, `area`, `price_range`, `party_size`, `consent_at` |

### Business Rules

- Three roles; a customer cannot open partner or administrator functions.
- Passwords are stored only as salted hashes; tokens expire.
- A partner can manage venues only after a listing is approved in group 2.
- Credentials and tokens never appear in Git or logs.

### Acceptance Criteria

- A new customer registers, signs in and sees only customer navigation.
- A customer token on a partner or admin endpoint returns `403`.
- A duplicate email is rejected with a clear error.
- A profile update is returned by the next `GET /me`.

---

## 2. Restaurant Onboarding

**Purpose:** Ensure customers see a curated, attributable venue record rather than unreviewed data.

### Main Functions

- Partner submits a venue form: name, address and district, cuisine, price range, opening hours, contact details, description, images.
- Partner saves a draft, submits it, and edits or resubmits after a return.
- Administrator reviews a queue, then approves, returns with a written reason, or rejects.
- Administrator can suspend or restore a published venue.
- Every decision is kept in a review history.

### Venue Status Flow

```mermaid
stateDiagram-v2
    [*] --> Draft : Partner creates listing
    Draft --> Submitted : Partner submits
    Submitted --> Approved : Admin approves
    Submitted --> Returned : Admin returns with reason
    Submitted --> Rejected : Admin rejects
    Returned --> Submitted : Partner resubmits
    Approved --> Suspended : Admin suspends
    Suspended --> Approved : Admin restores
    Approved --> [*]
    Rejected --> [*]
```

### Proposed API

```
POST   /partner/venues
PATCH  /partner/venues/{id}
POST   /partner/venues/{id}/submit
GET    /admin/venues?status=submitted
POST   /admin/venues/{id}/approve
POST   /admin/venues/{id}/return
POST   /admin/venues/{id}/reject
POST   /admin/venues/{id}/suspend
POST   /admin/venues/{id}/restore
```

### Data Schema

| Table | Columns |
|-------|---------|
| `venues` | `id`, `owner_id`, `name`, `address`, `district`, `cuisine`, `price_range`, `description`, `contact`, `status` |
| `venue_images` | `id`, `venue_id`, `url`, `position` |
| `venue_reviews` | `id`, `venue_id`, `admin_id`, `decision`, `reason`, `decided_at` |

### Business Rules

- Listing states: `Draft` → `Submitted` → `Approved` / `Returned` / `Rejected`; `Approved` can become `Suspended` and back.
- Only **Approved** venues appear in discovery.
- Required fields and image type and size are validated before submission.
- A returned listing shows the administrator's reason to the partner.

### Acceptance Criteria

- A venue missing a required field cannot be submitted.
- After approval the venue is searchable; after suspension it disappears from search while reservation history is kept.
- Each decision appears in the history with actor and time.

---

## 3. Restaurant Discovery

**Purpose:** Help a customer build and compare a shortlist before booking.

### Main Functions

- Search by restaurant name or area.
- Filter by cuisine, price range, amenities (e.g. parking, private room, outdoor seating) and, where capacity data exists, suitability for the party size.
- Sort by relevance or price.
- Result cards show photo, name, cuisine, price level, district and a booking shortcut.
- Venue detail page shows photos, description, address, opening hours, amenities, menu and the booking panel.
- An empty result suggests relaxing filters.

### Discovery Flow

```mermaid
flowchart LR
    A([Customer]) --> B["Enter search / filters"]
    B --> C{Results found?}
    C -- Yes --> D["Show venue cards"]
    C -- No --> E["Suggest relaxing filters"]
    D --> F["Open venue detail page"]
    F --> G["Booking panel"]
```

### Proposed API

```
GET /venues?q=&district=&cuisine=&price=&amenities=&party_size=&sort=&page=
GET /venues/{id}
```

### Data

- Reads: `venues`, `venue_images`, `opening_hours`, `capacity_rules`; amenity tags stored on the venue.
- Indexes on `name`, `district`, and `cuisine` to keep search fast.

### Business Rules

- Only **Approved**, non-suspended venues are returned.
- Filters from different categories combine with `AND`.
- Displayed information comes only from the partner-maintained record.

### Acceptance Criteria

- A search by cuisine and district returns only matching venues.
- A suspended venue never appears.
- The venue page opens from a result card and shows the booking panel without extra navigation.

---

## 4. Menus

**Purpose:** Let customers judge whether a venue suits them before reserving, and give group 9 verified menu data.

### Main Functions

- Partner creates, edits, reorders and removes categories and dishes: name, description, price, image, dietary tags, availability.
- Partner marks a dish temporarily unavailable without deleting it.
- Customer browses the menu by category on the venue page.
- Each menu keeps a last-updated time.

### Proposed API

```
GET    /venues/{id}/menu
POST   /partner/venues/{id}/menu/categories
POST   /partner/venues/{id}/menu/dishes
PATCH  /partner/menu/dishes/{dish_id}
DELETE /partner/menu/dishes/{dish_id}
```

### Data Schema

| Table | Columns |
|-------|---------|
| `menu_categories` | `id`, `venue_id`, `name`, `position` |
| `dishes` | `id`, `category_id`, `name`, `description`, `price_vnd`, `image_url`, `dietary_tags`, `available`, `updated_at` |

### Business Rules

- Prices are shown in VND as guidance only, because ordering and payment are out of scope.
- Only the owning partner can edit its menu.
- Unavailable dishes stay visible with a clear label.

### Acceptance Criteria

- A dish saved by a partner appears on the public venue page.
- A dish marked unavailable shows an *unavailable* label.
- A partner cannot modify another partner's menu (`403`).

---

## 5. Table Reservations

**Purpose:** Provide a clear request and confirmation flow so a request is never mistaken for a confirmed table.

### Main Functions

- Customer creates a request: venue, date, time, party size, optional note.
- Customer lists reservations, opens one, sees its status history, and cancels before a cutoff time.
- Partner lists incoming requests, then confirms or rejects with an optional reason.
- Both sides see the same status; an email is sent on each status change.

### Reservation Status Flow

```mermaid
stateDiagram-v2
    [*] --> Pending : Customer submits request
    Pending --> Confirmed : Partner confirms
    Pending --> Rejected : Partner rejects
    Pending --> Cancelled : Customer cancels
    Pending --> Expired : No partner response within window
    Confirmed --> Cancelled : Customer cancels before cutoff
    Confirmed --> [*]
    Rejected --> [*]
    Cancelled --> [*]
    Expired --> [*]
```

### Reservation Lifecycle

```mermaid
flowchart TD
    A([Customer]) --> B["Submit reservation request\n(venue, date, time, party size)"]
    B --> C{Venue validation}
    C -- Fails --> D["400 / 409 Error\n(closed, no capacity, overlap)"]
    C -- Passes --> E["Reservation created: Pending"]
    E --> F{Partner action}
    F -- Confirms --> G["Status: Confirmed\nEmail sent"]
    F -- Rejects --> H["Status: Rejected\nEmail sent"]
    F -- No response --> I["Scheduled job\nStatus: Expired"]
    G --> J{Customer cancels?}
    J -- Yes, before cutoff --> K["Status: Cancelled\nEmail sent"]
    J -- No --> L["Reservation fulfilled"]
```

### Proposed API

```
POST   /reservations
GET    /reservations
GET    /reservations/{id}
POST   /reservations/{id}/cancel
GET    /partner/reservations
POST   /partner/reservations/{id}/confirm
POST   /partner/reservations/{id}/reject
```

### Data Schema

| Table | Columns |
|-------|---------|
| `reservations` | `id`, `customer_id`, `venue_id`, `reserved_at`, `party_size`, `note`, `status`, `created_at`, `updated_at` |
| `reservation_status_history` | `id`, `reservation_id`, `from_status`, `to_status`, `actor_id`, `reason`, `changed_at` |

### Business Rules

- Accept a request only if the venue is approved, open at that time, and the party size fits the remaining capacity from group 7.
- A customer cannot hold two overlapping reservations.
- Every status change writes a history row with actor and time, in the same transaction as the update.
- Only the owning partner can confirm or reject; only the owning customer can cancel.
- Capacity check and insert run in one transaction to avoid double booking.

### Error Codes

| Code | Cause |
|------|-------|
| `400` | Invalid date/time, time in the past, invalid party size |
| `403` | Wrong role or owner |
| `404` | Unknown venue or reservation |
| `409` | Closed or blocked slot, no capacity, overlapping reservation, invalid status transition |

### Acceptance Criteria

- A submitted request starts as `Pending`.
- A request outside opening hours or for a blocked slot is refused with a clear message.
- After confirmation or cancellation both views show the same final status and history.
- An invalid transition (e.g. confirming a `Cancelled` request) is refused.

### Tests

- Unit tests for transition rules.
- API tests for each error code.
- A concurrency test with two requests competing for the last seats.

---

## 6. Event Booking

**Purpose:** Handle group occasions that need negotiation rather than a simple table, in one visible thread.

### Main Functions

- Customer submits an event brief: occasion, headcount, date and time, budget range, special needs, contact preference.
- Partner sends a proposal (price, menu package, conditions) or asks for clarification.
- Both sides exchange messages in the event thread.
- Customer accepts, declines or asks for a revision.

### Event Status Flow

```mermaid
stateDiagram-v2
    [*] --> Submitted : Customer submits brief
    Submitted --> ClarificationRequested : Partner asks for more info
    ClarificationRequested --> Submitted : Customer replies
    Submitted --> ProposalSent : Partner sends proposal
    ProposalSent --> Accepted : Customer accepts
    ProposalSent --> Declined : Customer declines
    ProposalSent --> Submitted : Customer requests revision
    Accepted --> Closed
    Declined --> Closed
    Closed --> [*]
```

### Proposed API

```
POST   /events
GET    /events
GET    /events/{id}
POST   /events/{id}/messages
POST   /partner/events/{id}/proposal
POST   /partner/events/{id}/clarify
POST   /events/{id}/accept
POST   /events/{id}/decline
```

### Data Schema

| Table | Columns |
|-------|---------|
| `event_requests` | `id`, `customer_id`, `venue_id`, `occasion`, `headcount`, `event_at`, `budget_min`, `budget_max`, `needs`, `status` |
| `event_messages` | `id`, `event_id`, `sender_id`, `body`, `created_at` |
| `event_proposals` | `id`, `event_id`, `price`, `package`, `conditions`, `created_at` |

### Business Rules

- Status flow: `Submitted` → `Clarification Requested` → `Proposal Sent` → `Accepted` / `Declined` → `Closed`.
- Only venues that enable event hosting receive briefs.
- An accepted proposal records the agreed terms; no payment or deposit is processed.
- Messages and proposals stay attached to the event and cannot be deleted.

### Acceptance Criteria

- A brief without headcount or date cannot be submitted.
- A partner proposal appears in the customer's thread and can be accepted or declined.
- Final status and agreed terms stay visible to both sides after closing.

---

## 7. Availability and Partner Dashboard

**Purpose:** Keep promises realistic by giving partners control over opening hours and capacity, and one place to handle incoming work.

### Main Functions

- Set weekly opening hours, closing days and holidays.
- Set capacity per time slot and block unavailable slots.
- Dashboard lists pending reservations, today's confirmed bookings, new event leads and recent status changes, with quick confirm, reject and reply actions.
- Basic counters: requests received, confirmed, cancelled.

### Slot Management Flow

```mermaid
flowchart LR
    P([Partner]) --> A["Configure opening hours\n& capacity rules"]
    A --> B["Block specific slots\n(optional)"]
    B --> C{Customer reservation request}
    C -- Slot available --> D["Reservation: Pending"]
    C -- Slot blocked / closed --> E["409 Conflict returned"]
    D --> F["Partner confirms / rejects\nvia Dashboard"]
```

### Proposed API

```
GET    /partner/venues/{id}/availability
PUT    /partner/venues/{id}/opening-hours
PUT    /partner/venues/{id}/capacity
POST   /partner/venues/{id}/blocked-slots
DELETE /partner/venues/{id}/blocked-slots/{slot_id}
GET    /partner/dashboard
```

### Data Schema

| Table | Columns |
|-------|---------|
| `opening_hours` | `venue_id`, `weekday`, `open_time`, `close_time` |
| `closures` | `venue_id`, `date`, `reason` |
| `capacity_rules` | `venue_id`, `slot`, `seats` |
| `blocked_slots` | `id`, `venue_id`, `start_at`, `end_at`, `reason` |

### Business Rules

- Reservation checks (group 5) always use the latest settings.
- A capacity change affects only new requests.
- Blocking a slot does not cancel confirmed reservations automatically; the API returns the affected reservations so the partner can handle them.
- Only the owning partner and administrators can change these settings.

### Acceptance Criteria

- A blocked slot returns `409` when a customer tries to book it.
- Changing capacity does not alter existing confirmed reservations.
- Dashboard counts match the reservation and event data.

---

## 8. Promotions and Editorial

**Purpose:** Let partners present time-bound value and short venue stories while the platform controls quality.

### Main Functions

- Partner creates a promotion: title, description, start and end date, eligibility (days, time, minimum party size).
- Partner publishes short editorial content, such as a venue story or seasonal feature, with images.
- Administrator reviews content against platform rules and can hide or remove it.
- Customer sees active promotions on cards and venue pages.

### Proposed API

```
GET    /venues/{id}/promotions
GET    /promotions?active=true
POST   /partner/promotions
PATCH  /partner/promotions/{id}
POST   /partner/editorial
POST   /admin/content/{id}/hide
```

### Data Schema

| Table | Columns |
|-------|---------|
| `promotions` | `id`, `venue_id`, `title`, `description`, `starts_at`, `ends_at`, `conditions`, `status` |
| `editorial_posts` | `id`, `venue_id`, `title`, `body`, `images`, `status`, `moderation_reason` |

### Business Rules

- Promotions expire automatically at the end date.
- Conditions and expiry are shown wherever an offer appears.
- Content that breaks platform rules is removed with a recorded reason.
- Promotions are informational and are not applied through online payment.

### Acceptance Criteria

- An expired promotion no longer appears as active.
- Every displayed offer shows its conditions and end date.
- Administrator-hidden content disappears from public pages but stays in the partner's list with the reason.

---
## 9. Notifications

**Purpose:** Keep customers and partners informed of every status change without requiring them to poll the application.

### Main Functions

- Send an email to both parties on every reservation and event status change.
- Send an in-app notification badge on login (or via WebSocket if real-time is added later).
- Partner receives an alert when a new reservation request arrives.
- Customer receives confirmation when a reservation is confirmed, rejected, or expires.
- Notifications are queued and retried; a failed delivery is logged but does not block the triggering action.

### Notification Trigger Flow

```mermaid
flowchart TD
    A["Business event occurs\n(reservation status change, event proposal, etc.)"] --> B["Backend emits notification task\nto queue"]
    B --> C["Notification worker picks up task"]
    C --> D{Delivery channel}
    D -- Email --> E["Send via SMTP / email provider"]
    D -- In-app --> F["Write to notifications table"]
    E --> G{Delivery success?}
    G -- Yes --> H["Mark as sent"]
    G -- No --> I["Retry up to N times\nThen mark as failed + log"]
    F --> H
```

### Proposed API

```
GET    /me/notifications           (list unread notifications)
PATCH  /me/notifications/{id}/read
DELETE /me/notifications/{id}
```

### Data Schema

| Table | Columns |
|-------|---------|
| `notifications` | `id`, `user_id`, `type`, `payload` (JSON), `read_at`, `created_at` |
| `notification_log` | `id`, `notification_id`, `channel` (email / in-app), `status`, `attempts`, `last_attempted_at` |

### Business Rules

- Every status transition in groups 5 and 6 triggers a notification to both the customer and the relevant partner.
- Email content uses templates; no dynamic code is executed in the template engine.
- A notification failure does not roll back the transaction that triggered it.
- Unread count is shown on the navigation bar after login.

### Acceptance Criteria

- Within 30 seconds of a status change an email is dispatched to the affected users.
- A failed email is retried at least twice before being marked as failed.
- The in-app list shows all notifications in reverse chronological order; marking one read clears its badge.

---

<!-- ADDED: Group 11 – Ratings and Reviews (entire section is new, not in commit aa1e8ca) -->

## 10. Ratings and Reviews

**Purpose:** Give future customers reliable social proof based on actual visits, and give partners structured feedback.

### Main Functions

- After a reservation reaches a terminal confirmed state and the visit date has passed, the customer is invited to leave a rating (1–5 stars) and an optional text review.
- Customer can edit or delete their own review within a grace period.
- Administrator can hide a review that violates community rules, with a recorded reason.
- Venue detail page shows the aggregated star rating and a paginated list of reviews.
- Partner can reply to a review once.

### Review Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Eligible : Visit date passes + reservation Confirmed
    Eligible --> Submitted : Customer submits review
    Submitted --> Published : Auto-published
    Published --> Edited : Customer edits within grace period
    Edited --> Published
    Published --> Hidden : Admin hides with reason
    Hidden --> Published : Admin restores
    Published --> [*]
    Hidden --> [*]
```

### Proposed API

```
GET    /venues/{id}/reviews                (public)
POST   /reservations/{id}/review           (customer submits)
PATCH  /reviews/{id}                       (customer edits, within grace period)
DELETE /reviews/{id}                       (customer deletes, within grace period)
POST   /reviews/{id}/reply                 (partner replies)
POST   /admin/reviews/{id}/hide
POST   /admin/reviews/{id}/restore
```

### Data Schema

| Table | Columns |
|-------|---------|
| `reviews` | `id`, `reservation_id`, `customer_id`, `venue_id`, `rating` (1–5), `body`, `status`, `created_at`, `edited_at` |
| `review_replies` | `id`, `review_id`, `partner_id`, `body`, `created_at` |
| `review_moderation` | `id`, `review_id`, `admin_id`, `action` (hide/restore), `reason`, `acted_at` |

### Business Rules

- Only customers with a past `Confirmed` reservation at that venue may submit a review.
- One review per reservation; a second submission on the same reservation is rejected.
- A customer may edit or delete their review within 7 days of submission (grace period TBC with team).
- A partner may reply once per review and cannot edit the reply afterward.
- Aggregate rating = average of all published ratings, recalculated on each new submission.
- Hidden reviews are excluded from the aggregate and public listing but remain accessible to the admin.

### Acceptance Criteria

- A customer without a confirmed past reservation at the venue cannot submit a review (`403`).
- A second review on the same reservation is rejected (`409`).
- After a review is hidden the aggregate rating updates accordingly.
- The partner reply appears below the review on the venue page.

---

<!-- ADDED: Cancellation Policy (entire section is new, not in commit aa1e8ca) -->

## Cancellation Policy

**Purpose:** Define clear, consistent rules for when and how reservations can be cancelled, protecting both customer experience and partner planning.

### Policy Rules

| Scenario | Who | Allowed? | Condition |
|----------|-----|----------|-----------|
| Customer cancels a `Pending` request | Customer | ✅ Always | No cutoff applies |
| Customer cancels a `Confirmed` reservation | Customer | ✅ Yes | Must be before the cutoff window |
| Customer cancels after cutoff | Customer | ❌ No | API returns `409` |
| Partner rejects a `Pending` request | Partner | ✅ Always | — |
| Partner cancels a `Confirmed` reservation | Partner | ⚠️ Contact admin | Out of normal flow |
| System auto-expires a `Pending` reservation | System (cron) | ✅ Yes | After the response window |

### Cutoff & Response Window (Open — see Open Questions)

```mermaid
flowchart LR
    A["Reservation created"] --> B["Response window\n(e.g. 4 h — TBC)"]
    B -- Partner responds --> C["Confirmed or Rejected"]
    B -- No response --> D["Auto-Expired by cron"]
    C --> E["Cancellation window\n(e.g. 2 h before visit — TBC)"]
    E -- Before cutoff --> F["Customer can cancel"]
    E -- After cutoff --> G["Cancel blocked (409)"]
```

### Implementation Notes

- The cutoff is stored as a system-wide config value so it can be adjusted without a code deploy.
- The scheduled job that expires `Pending` reservations runs at a cadence short enough that no request sits expired-but-unlabelled for more than a few minutes.
- All cancellation events write a `reservation_status_history` row (same as group 5).

---

<!-- ADDED: Non-Functional Requirements (entire section is new, not in commit aa1e8ca) -->

## Non-Functional Requirements

### Performance

| Target | Requirement |
|--------|-------------|
| Search (Group 3) | p95 response ≤ 300 ms under typical load |
| Reservation submit (Group 5) | p95 response ≤ 500 ms; capacity check + insert in one transaction |
| List endpoints | All paginated; default page size 20 |
| Notification dispatch | Email dispatched within 30 s of trigger |

### Security

- All endpoints use HTTPS; HTTP connections are redirected.
- JWT access tokens expire in 15 minutes; refresh tokens are rotated on use.
- Role and ownership checks are enforced in a shared middleware layer applied to every protected endpoint.
- Passwords use bcrypt with a minimum cost factor of 12.
- No credentials, PII, or tokens are written to application logs or committed to Git.
- File uploads (venue images, dish images) are validated for MIME type and size before being stored.

### Scalability

- The FastAPI application is stateless; horizontal scaling is achieved by running multiple instances behind a load balancer.
- PostgreSQL is the single source of truth; read replicas may be added for search queries if needed.
- The notification queue decouples email delivery from the request path, preventing slow SMTP calls from affecting API latency.
- Database migrations run via Alembic and are backwards-compatible where possible.

### Reliability

- The API returns a structured error for every foreseeable failure; no stack traces are exposed to clients.
- Capacity checks use `SELECT ... FOR UPDATE` or equivalent to prevent double booking under concurrent load.
- A failing AI component (Group 9) falls back to ordinary filters without returning an error to the user.

---
