# DineVina - Use-Case Specification: Guest and Customer Use Cases
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

## Revision History
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 13 November 2026 | 1.0 | Specifications of use cases UC-C01 to UC-C13. | Võ Mỹ Ngọc |

## Table of Contents
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

The use cases are ordered by the customer workflow.

1. UC-C01 Register Customer Account
2. UC-C02 Sign In
3. UC-C03 Manage Profile and Preferences
4. UC-C04 Search and Filter Restaurants
5. UC-C05 View Restaurant Details
6. UC-C06 View Menu
7. UC-C07 View Promotions
8. UC-C08 Check Slot Availability
9. UC-C09 Submit Table Reservation Request
10. UC-C10 Track Reservation Requests
11. UC-C11 Cancel Reservation
12. UC-C12 Submit Event Inquiry
13. UC-C13 Respond to Event Inquiry

Requirement IDs (`FR-`) refer to the functional requirement catalogue of the Use-Case Model. Non-functional requirement IDs (`PERF-`, `SEC-`, `REL-`, `STD-`, `PLAT-`, `A11Y-`, `PRIV-`) refer to Section 6 of the Vision Document.

---

## UC-C01 Register Customer Account
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

**1. Use-Case Name:** UC-C01 Register Customer Account

**Actor(s):** Guest

**1.1 Brief Description**

A guest creates a customer account with their contact information so that they can submit and track reservation requests and event inquiries for themselves. Realizes FR-1.1.

**2. Flow of Events**

**2.1 Basic Flow**

1. The guest selects **Register**.
2. The system displays the registration form with the fields full name, phone number and password.
3. The guest enters the information and submits the form.
4. The system checks that all fields are filled and that the phone number has a valid format.
5. The system checks that no account is registered with the same phone number.
6. The system creates the customer account.
7. The system confirms that the account has been created. The guest can now sign in with it (UC-C02).

**2.2 Alternative Flows**

**2.2.1 A1 - Required field missing.** At step 4, if a field is empty, the system highlights the field and shows a message. The flow returns to step 3.

**2.2.2 A2 - Invalid phone number.** At step 4, if the phone number format is invalid, the system shows an inline message under the phone field. The flow returns to step 3.

**2.2.3 A3 - Phone number already registered.** At step 5, if an account already uses the phone number, the system informs the guest and offers **Sign In** (UC-C02). The use case ends without creating an account.

**2.2.4 A4 - Guest cancels.** At any step before step 6, the guest leaves the form. No account is created.

**2.2.5 A5 - Storage unavailable.** At step 6, if the account cannot be stored, the system shows a retryable error and no account is created. The flow returns to step 3 with the entered data kept, except the password.

**3. Special Requirements**

- SEC-01: the form is submitted over HTTPS.
- SEC-02: the password is stored only as a salted hash and never written to logs.
- A11Y-01: every field has a visible label and the form is keyboard-operable.
- PLAT-01: the form is usable at 360 px and 1280 px widths.

**4. Preconditions**

- The guest is not signed in.

**5. Postconditions**

- Success: a customer account exists and can be used to sign in.
- Failure: no account is created.

**6. Extension Points**

None.

**7. Prototype Screens**

*UC-C01 - Basic flow: Register*

![UC-C01 Basic flow: Register](prototype/UC-C01-Main-register.png)

*UC-C01 - Alternative flow A1: Required field missing*

![UC-C01 Alternative flow A1: Required field missing](prototype/UC-C01-A1-required-field-missing.png)

*UC-C01 - Alternative flow A2: Invalid phone*

![UC-C01 Alternative flow A2: Invalid phone](prototype/UC-C01-A2-invalid-phone.png)

*UC-C01 - Alternative flow A3: Phone already registered*

![UC-C01 Alternative flow A3: Phone already registered](prototype/UC-C01-A3-phone-already-registered.png)

*UC-C01 - Alternative flow A5: Storage unavailable*

![UC-C01 Alternative flow A5: Storage unavailable](prototype/UC-C01-A5-storage-unavailable.png)

---

## UC-C02 Sign In
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

**1. Use-Case Name:** UC-C02 Sign In

**Actor(s):** Customer, Partner Staff, Administrator

**1.1 Brief Description**

A registered user signs in to DineVina. The system grants only the functions and records that belong to the user's role. Realizes FR-1.3.

**2. Flow of Events**

**2.1 Basic Flow**

1. The user selects **Sign In**.
2. The system displays the sign-in form with the fields phone number and password.
3. The user enters the credentials and submits the form.
4. The system verifies the credentials.
5. The system starts a session for the user and identifies the user's role.
6. The system displays the start page of the role: the home page for a customer, the partner dashboard (UC-P05) for partner staff, or the administrator workspace for an administrator.

**2.2 Alternative Flows**

**2.2.1 A1 - Invalid credentials.** At step 4, if the phone number or password is wrong, the system shows a message that the credentials are incorrect. The flow returns to step 3.

**2.2.2 A2 - Sign-in required by another use case.** If the sign-in was started because a guest tried to perform a customer-only action (for example UC-C09 or UC-C12), then at step 6 the system returns the customer to that action instead of the home page.

**2.2.3 A3 - Session expired.** When the session of a signed-in user expires, the system asks the user to sign in again. The flow continues at step 2.

**2.2.4 A4 - User cancels.** The user leaves the form before step 4. The user stays signed out.

**3. Special Requirements**

- SEC-01: credentials are sent only over HTTPS, and every partner or administrator action checks the role and venue ownership on the server.
- SEC-03: if JWT sessions are adopted, the access token lives 15 minutes and the refresh token 7 days with rotation.
- A11Y-01 and PLAT-01 apply to the sign-in form.

**4. Preconditions**

- The user has an account.
- The user is not signed in.

**5. Postconditions**

- Success: the user has an active session limited to the functions of their role.
- Failure: the user remains signed out.

**6. Extension Points**

None.

**7. Prototype Screens**

*UC-C02 - Basic flow: Sign in*

![UC-C02 Basic flow: Sign in](prototype/UC-C02-Main-sign-in.png)

*UC-C02 - Alternative flow A1: Invalid credentials*

![UC-C02 Alternative flow A1: Invalid credentials](prototype/UC-C02-A1-invalid-credentials.png)

*UC-C02 - Alternative flow A2: Sign in required*

![UC-C02 Alternative flow A2: Sign in required](prototype/UC-C02-A2-sign-in-required.png)

*UC-C02 - Alternative flow A3: Session expired*

![UC-C02 Alternative flow A3: Session expired](prototype/UC-C02-A3-session-expired.png)

---

## UC-C03 Manage Profile and Preferences
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

**1. Use-Case Name:** UC-C03 Manage Profile and Preferences

**Actor(s):** Customer

**1.1 Brief Description**

A customer maintains their contact information and dining preferences. The contact information is reused to pre-fill booking forms, and the preferences are reused as recommendation input. Realizes FR-1.4.

**2. Flow of Events**

**2.1 Basic Flow**

1. The customer selects **My Profile**.
2. The system displays the contact information (full name, phone number) and the dining preferences (cuisine, budget, district, party size, occasion).
3. The customer edits the information and selects **Save**.
4. The system validates the information.
5. The system saves the changes and shows a confirmation message.

**2.2 Alternative Flows**

**2.2.1 A1 - Invalid contact information.** At step 4, if the full name is empty or the phone number format is invalid, the system highlights the field and shows a message. The flow returns to step 3.

**2.2.2 A2 - No preferences entered.** At step 3, the customer may leave every preference empty. The system saves the profile without preferences.

**2.2.3 A3 - Customer discards changes.** At step 3, the customer selects **Cancel**. The system discards the edits and shows the saved profile.

**2.2.4 A4 - Storage unavailable.** At step 5, if the changes cannot be stored, the system shows a retryable error and keeps the edited values on the form. The flow returns to step 3.

**3. Special Requirements**

- PRIV-01: preferences are saved only from the customer's explicit input and are not sent to external model training.
- A11Y-01 and PLAT-01 apply to the profile form.

**4. Preconditions**

- The customer is signed in.

**5. Postconditions**

- Success: the profile stores the new contact information and preferences.
- Failure: the stored profile is unchanged.

**6. Extension Points**

None.

**7. Prototype Screens**

*UC-C03 - Basic flow: My profile*

![UC-C03 Basic flow: My profile](prototype/UC-C03-Main1-my-profile.png)

*UC-C03 - Basic flow: Profile saved*

![UC-C03 Basic flow: Profile saved](prototype/UC-C03-Main2-profile-saved.png)

*UC-C03 - Alternative flow A1: Invalid contact information*

![UC-C03 Alternative flow A1: Invalid contact information](prototype/UC-C03-A1-invalid-contact-information.png)

*UC-C03 - Alternative flow A4: Storage unavailable*

![UC-C03 Alternative flow A4: Storage unavailable](prototype/UC-C03-A4-storage-unavailable.png)

---

## UC-C04 Search and Filter Restaurants
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

**1. Use-Case Name:** UC-C04 Search and Filter Restaurants

**Actor(s):** Guest (also Customer)

**1.1 Brief Description**

A guest searches approved restaurants and foods in Ho Chi Minh City by keyword and narrows the results with filters, without signing in or granting location permission. Realizes FR-3.1, FR-3.2, FR-3.3, FR-3.5 and FR-2.4.

**2. Flow of Events**

**2.1 Basic Flow**

1. The guest opens the search page.
2. The system displays a keyword field and the filters district, cuisine, budget (minimum and maximum spend per person in VND), party size, capacity and amenities.
3. The guest enters a keyword, a set of filters, or both, and selects **Search**.
4. The system retrieves the approved venues that match the criteria.
5. The system displays the first page of results. Each result card shows the venue name, cover photo, cuisine, district and price range.
6. The guest selects a venue. The use case continues in UC-C05.

**2.2 Alternative Flows**

**2.2.1 A1 - Sort results.** At step 5, the guest selects a sort order (price low to high or price high to low). The system reorders the results and returns to step 5.

**2.2.2 A2 - Change page.** At step 5, the guest selects the next or previous page. The system displays that page of results and returns to step 5.

**2.2.3 A3 - No matching venue.** At step 4, if no approved venue matches, the system shows a message that no venue fits the criteria and keeps the entered criteria so the guest can adjust the filters. The flow returns to step 3.

**2.2.4 A4 - Invalid filter value.** At step 4, if the minimum budget is greater than the maximum budget or the party size is outside 1 to 50, the system shows a message next to the filter. The flow returns to step 3.

**2.2.5 A5 - Search service error.** At step 4, if the search fails, the system shows an error message with a **Try again** action. Selecting it repeats step 4.

**2.2.6 A6 - Ask for recommendations.** At step 3, the guest switches to recommendation mode at the *Recommendation* extension point. The use case continues in UC-AI01.

**3. Special Requirements**

- FR-2.4: only approved venues are returned.
- PERF-01: search p95 is at most 300 ms at 50 requests per second against 1,000 fixture venues.
- PERF-04: a page contains 20 results by default and at most 50.
- STD-01: errors are returned with a stable code, a message and a request ID.
- PLAT-01 and A11Y-01 apply to the search page.

**4. Preconditions**

- None. Signing in is not required.

**5. Postconditions**

- A list of approved matching venues, or an empty-result message, is displayed. No data is changed.

**6. Extension Points**

- *Recommendation*: at step 3, where UC-AI01 Get Explainable Recommendations may be started.

**7. Prototype Screens**

*UC-C04 - Basic flow: Search results*

![UC-C04 Basic flow: Search results](prototype/UC-C04-Main-search-results.png)

*UC-C04 - Alternative flow A3: No matching venue*

![UC-C04 Alternative flow A3: No matching venue](prototype/UC-C04-A3-no-matching-venue.png)

*UC-C04 - Alternative flow A4: Invalid filter value*

![UC-C04 Alternative flow A4: Invalid filter value](prototype/UC-C04-A4-invalid-filter-value.png)

*UC-C04 - Alternative flow A5: Search service error*

![UC-C04 Alternative flow A5: Search service error](prototype/UC-C04-A5-search-service-error.png)

---

## UC-C05 View Restaurant Details
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

**1. Use-Case Name:** UC-C05 View Restaurant Details

**Actor(s):** Guest (also Customer)

**1.1 Brief Description**

A guest opens the page of an approved venue to inspect its details before deciding whether to request a table or an event. Realizes FR-3.4.

**2. Flow of Events**

**2.1 Basic Flow**

1. The guest selects a venue from the search results or from a recommendation.
2. The system retrieves the approved details of the venue.
3. The system displays the venue page with name, photos, location (address and district), cuisine, amenities, capacity and contact details.
4. The system displays the actions **View Menu**, **Check Availability**, **Reserve a Table** and **Plan an Event**.
5. The guest selects an action or returns to the results.

**2.2 Alternative Flows**

**2.2.1 A1 - Venue no longer available.** At step 2, if the venue has been unpublished by an administrator, the system shows a message that the venue is not available and offers a return to the search results.

**2.2.2 A2 - Venue not found.** At step 2, if the venue does not exist, the system shows a not-found message and offers a return to the search page.

**2.2.3 A3 - Service error.** At step 2, if the details cannot be loaded, the system shows an error message with a **Try again** action.

**2.2.4 A4 - View the menu.** At step 5, the guest selects **View Menu** at the *Menu* extension point. The use case continues in UC-C06.

**2.2.5 A5 - Ask the assistant.** At step 5, the guest opens the assistant at the *Assistant* extension point. The use case continues in UC-AI02.

**3. Special Requirements**

- Only approved venue information is displayed.
- PLAT-01 and A11Y-01 apply to the venue page.

**4. Preconditions**

- The venue is approved and published.

**5. Postconditions**

- The venue page is displayed. No data is changed.

**6. Extension Points**

- *Menu*: at step 5, where UC-C06 View Menu may be started.
- *Assistant*: at step 5, where UC-AI02 Ask Menu and Policy Assistant may be started.

**7. Prototype Screens**

*UC-C05 - Basic flow: Restaurant details*

![UC-C05 Basic flow: Restaurant details](prototype/UC-C05-Main-restaurant-details.png)

*UC-C05 - Alternative flow A1: Venue not available*

![UC-C05 Alternative flow A1: Venue not available](prototype/UC-C05-A1-venue-not-available.png)

*UC-C05 - Alternative flow A2: Venue not found*

![UC-C05 Alternative flow A2: Venue not found](prototype/UC-C05-A2-venue-not-found.png)

*UC-C05 - Alternative flow A3: Service error*

![UC-C05 Alternative flow A3: Service error](prototype/UC-C05-A3-service-error.png)

---

## UC-C06 View Menu
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

**1. Use-Case Name:** UC-C06 View Menu

**Actor(s):** Guest (also Customer)

**1.1 Brief Description**

A guest reviews the menu items and prices of a venue before submitting a request, so that they can judge whether the venue fits their budget and occasion. Extends UC-C05. Realizes FR-4.2.

**2. Flow of Events**

**2.1 Basic Flow**

1. On the venue page, the guest selects **View Menu**.
2. The system retrieves the menu items of the venue.
3. The system displays each item with its name, description and price.
4. The guest reviews the menu and returns to the venue page.

**2.2 Alternative Flows**

**2.2.1 A1 - No menu items.** At step 2, if the venue has no menu items, the system shows a message that the menu is not available yet. The flow returns to the venue page.

**2.2.2 A2 - Service error.** At step 2, if the menu cannot be loaded, the system shows an error message with a **Try again** action.

**3. Special Requirements**

- Prices are shown in VND.
- PLAT-01 and A11Y-01 apply to the menu view.

**4. Preconditions**

- The venue page of an approved venue is displayed (UC-C05).

**5. Postconditions**

- The menu is displayed. No data is changed.

**6. Extension Points**

None.

**7. Prototype Screens**

*UC-C06 - Basic flow: Menu*

![UC-C06 Basic flow: Menu](prototype/UC-C06-Main-menu.png)

*UC-C06 - Alternative flow A1: No menu items*

![UC-C06 Alternative flow A1: No menu items](prototype/UC-C06-A1-no-menu-items.png)

*UC-C06 - Alternative flow A2: Service error*

![UC-C06 Alternative flow A2: Service error](prototype/UC-C06-A2-service-error.png)

---

## UC-C07 View Promotions
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

**1. Use-Case Name:** UC-C07 View Promotions

**Actor(s):** Guest (also Customer)

**1.1 Brief Description**

A guest views the promotions published by restaurant partners, with their eligibility conditions and expiry information. Realizes FR-8.4.

**2. Flow of Events**

**2.1 Basic Flow**

1. The guest opens the promotions page.
2. The system retrieves the promotions approved by an administrator.
3. The system displays each promotion with the venue name, the offer, the eligibility conditions and the expiry information.
4. The guest selects the venue of a promotion. The use case continues in UC-C05.

**2.2 Alternative Flows**

**2.2.1 A1 - No promotion.** At step 2, if there is no approved promotion, the system shows a message that no promotion is available.

**2.2.2 A2 - Service error.** At step 2, if the promotions cannot be loaded, the system shows an error message with a **Try again** action.

**3. Special Requirements**

- The eligibility conditions and expiry information are always visible next to the offer.
- A promotion does not create or confirm a reservation.

**4. Preconditions**

- None. Signing in is not required.

**5. Postconditions**

- The promotions are displayed. No data is changed.

**6. Extension Points**

None.

**7. Prototype Screens**

*UC-C07 - Basic flow: Promotions*

![UC-C07 Basic flow: Promotions](prototype/UC-C07-Main-promotions.png)

*UC-C07 - Alternative flow A1: No promotion*

![UC-C07 Alternative flow A1: No promotion](prototype/UC-C07-A1-no-promotion.png)

*UC-C07 - Alternative flow A2: Service error*

![UC-C07 Alternative flow A2: Service error](prototype/UC-C07-A2-service-error.png)

---

## UC-C08 Check Slot Availability
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

**1. Use-Case Name:** UC-C08 Check Slot Availability

**Actor(s):** Guest (also Customer)

**1.1 Brief Description**

A guest checks which time slots of a venue can serve their party on a chosen date. The use case is also included by UC-C09, UC-P06 and UC-P09 to check the remaining capacity of one slot. Realizes FR-5.1 and FR-7.3.

**2. Flow of Events**

**2.1 Basic Flow**

1. On the venue page, the guest selects **Check Availability**.
2. The system displays a date picker and a party-size field.
3. The guest selects a date and enters the party size.
4. The system validates the date and party size.
5. The system retrieves the service slots of the venue for that date.
6. The system displays each slot with its time, its status (*Available* or *Sold out*) and its remaining capacity.
7. The guest selects an available slot. The guest may continue with UC-C09.

**2.2 Alternative Flows**

**2.2.1 A1 - Date in the past.** At step 4, if the date is in the past, the system shows a message. The flow returns to step 3.

**2.2.2 A2 - Party size out of range.** At step 4, if the party size is outside 1 to 50 or exceeds the venue limit, the system shows a message. The flow returns to step 3.

**2.2.3 A3 - No available slot.** At step 6, if every slot is sold out, the system shows a message and suggests choosing another date. The flow returns to step 3.

**2.2.4 A4 - Included capacity check.** When included by UC-C09, UC-P06 or UC-P09, the system checks the remaining capacity of the given slot for the given party size and returns whether the slot can serve the party. No slot list is displayed.

**2.2.5 A5 - Service error.** At step 5, if the slots cannot be loaded, the system shows an error message with a **Try again** action.

**3. Special Requirements**

- FR-7.3 and REL-01: the capacity check and the following state change are atomic; no slot is confirmed beyond its capacity, even with 20 concurrent overlapping requests.
- Slots use a 30-minute granularity.

**4. Preconditions**

- The venue is approved and published.

**5. Postconditions**

- The slots and their remaining capacity are displayed, or the result of the capacity check is returned to the including use case. No data is changed by this use case.

**6. Extension Points**

None.

**7. Prototype Screens**

*UC-C08 - Basic flow: Check availability*

![UC-C08 Basic flow: Check availability](prototype/UC-C08-Main-check-availability.png)

*UC-C08 - Alternative flow A1: Date in the past*

![UC-C08 Alternative flow A1: Date in the past](prototype/UC-C08-A1-date-in-the-past.png)

*UC-C08 - Alternative flow A2: Party size out of range*

![UC-C08 Alternative flow A2: Party size out of range](prototype/UC-C08-A2-party-size-out-of-range.png)

*UC-C08 - Alternative flow A3: No available slot*

![UC-C08 Alternative flow A3: No available slot](prototype/UC-C08-A3-no-available-slot.png)

*UC-C08 - Alternative flow A5: Service error*

![UC-C08 Alternative flow A5: Service error](prototype/UC-C08-A5-service-error.png)

---

## UC-C09 Submit Table Reservation Request
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

**1. Use-Case Name:** UC-C09 Submit Table Reservation Request

**Actor(s):** Customer

**1.1 Brief Description**

A customer submits a table reservation request for themselves. The request is stored in the *Pending confirmation* state and is not a confirmed reservation until the restaurant partner confirms it. Includes UC-C08. Realizes FR-5.2.

**2. Flow of Events**

**2.1 Basic Flow**

1. On the venue page, the customer selects **Reserve a Table**.
2. The system displays the reservation form with the fields name, phone number, date, time, party size and special requests (optional). Name and phone number are pre-filled from the profile, and date, time and party size are pre-filled from the selected slot if one was chosen in UC-C08.
3. The customer completes the form and selects **Submit Request**.
4. The system validates the fields.
5. The system checks the remaining capacity of the chosen slot (include UC-C08).
6. The system creates the reservation request in the *Pending confirmation* state, temporarily holds the slot capacity and records the first entry of the status history.
7. The system displays the request summary with the status *Pending confirmation*, the confirmation deadline, and the cancellation conditions, and states that the reservation is not confirmed yet.

**2.2 Alternative Flows**

**2.2.1 A1 - Customer not signed in.** At step 1, if the user is a guest, the system starts UC-C02 Sign In. After a successful sign-in, the flow continues at step 2.

**2.2.2 A2 - Invalid field.** At step 4, if a required field is empty or the phone number format is invalid, the system highlights the field and shows a message. The flow returns to step 3.

**2.2.3 A3 - Date or party size not accepted.** At step 4, if the date and time are in the past or the party size exceeds the venue limit, the system shows a message. The flow returns to step 3.

**2.2.4 A4 - Slot fully booked.** At step 5, if the slot no longer has enough capacity, the system shows a message and suggests the adjacent slots 30 minutes earlier and later. The customer selects another slot and the flow returns to step 5, or the customer leaves the form and the use case ends.

**2.2.5 A5 - Storage unavailable.** At step 6, if the request cannot be stored, the system shows a retryable error and no request is created. The flow returns to step 3 with the entered data kept.

**2.2.6 A6 - Repeated submission.** At step 3, if the customer submits the same request again because the connection was interrupted, the system does not create a second request and shows the summary of the existing one (step 7).

**2.2.7 A7 - Customer leaves the form.** Before step 6, the customer leaves the form. No request is created.

**3. Special Requirements**

- The customer can submit a request only for themselves, with their own name and phone number.
- PERF-02: request submission p95 is at most 500 ms; the capacity decision and the creation of the request are atomic.
- REL-03: when persistent storage is unavailable, the write is rejected safely and is never redirected to a separate store.
- The labels *Pending confirmation* and *Confirmed* are visually distinct.

**4. Preconditions**

- The customer is signed in.
- The venue is approved and published.

**5. Postconditions**

- Success: a reservation request exists in the *Pending confirmation* state, the slot capacity is held, and the request appears on the partner dashboard (UC-P05).
- Failure: no request is created and no capacity is held.

**6. Extension Points**

None.

**7. Prototype Screens**

*UC-C09 - Basic flow: Reservation form*

![UC-C09 Basic flow: Reservation form](prototype/UC-C09-Main1-reservation-form.png)

*UC-C09 - Basic flow: Request submitted*

![UC-C09 Basic flow: Request submitted](prototype/UC-C09-Main2-request-submitted.png)

*UC-C09 - Alternative flow A2: Invalid field*

![UC-C09 Alternative flow A2: Invalid field](prototype/UC-C09-A2-invalid-field.png)

*UC-C09 - Alternative flow A3: Date or party size not accepted*

![UC-C09 Alternative flow A3: Date or party size not accepted](prototype/UC-C09-A3-date-or-party-size-not-accepted.png)

*UC-C09 - Alternative flow A4: Slot fully booked*

![UC-C09 Alternative flow A4: Slot fully booked](prototype/UC-C09-A4-slot-fully-booked.png)

*UC-C09 - Alternative flow A5: Storage unavailable*

![UC-C09 Alternative flow A5: Storage unavailable](prototype/UC-C09-A5-storage-unavailable.png)

---

## UC-C10 Track Reservation Requests
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

**1. Use-Case Name:** UC-C10 Track Reservation Requests

**Actor(s):** Customer

**1.1 Brief Description**

A customer views their reservation requests and event inquiries with the current state and the full status history, so that a request is never confused with a confirmed commitment. Realizes FR-5.4.

**2. Flow of Events**

**2.1 Basic Flow**

1. The customer selects **My Requests**.
2. The system lists the customer's reservation requests and event inquiries. Each entry shows the venue, the date and time, the party size and the current state.
3. The customer selects an entry.
4. The system displays the details of the entry and its status history. Each history entry shows the state, the time, the actor and, where given, the reason.
5. For a reservation, the system also displays the cancellation deadline.

**2.2 Alternative Flows**

**2.2.1 A1 - No requests.** At step 2, if the customer has no request, the system shows an empty list with a link to the search page (UC-C04).

**2.2.2 A2 - Declined reservation.** At step 4, if the reservation was declined, the system shows the reason given by the partner.

**2.2.3 A3 - Expired reservation.** At step 4, if the partner did not answer within the 30-minute response window, the system shows the state *Expired*.

**2.2.4 A4 - Reservation cancelled by the restaurant.** At step 4, if the restaurant cancelled the confirmed reservation, the system shows the state *Cancelled by restaurant*.

**2.2.5 A5 - Cancel a reservation.** At step 5, if the reservation is *Confirmed*, the customer may select **Cancel** at the *Cancel* extension point. The use case continues in UC-C11.

**2.2.6 A6 - Respond to an event inquiry.** At step 4, if the partner has requested clarification or sent a proposal, the customer may select **Respond** at the *Respond* extension point. The use case continues in UC-C13.

**2.2.7 A7 - Service error.** At step 2 or step 4, if the data cannot be loaded, the system shows an error message with a **Try again** action.

**3. Special Requirements**

- REL-02: every status change keeps its actor, time and reason.
- The states *Pending confirmation* and *Confirmed* are labelled distinctly.
- The customer sees only their own requests.

**4. Preconditions**

- The customer is signed in.

**5. Postconditions**

- The requests and their history are displayed. No data is changed by this use case.

**6. Extension Points**

- *Cancel*: at step 5, where UC-C11 Cancel Reservation may be started.
- *Respond*: at step 4, where UC-C13 Respond to Event Inquiry may be started.

**7. Prototype Screens**

*UC-C10 - Basic flow: My requests*

![UC-C10 Basic flow: My requests](prototype/UC-C10-Main1-my-requests.png)

*UC-C10 - Basic flow: Request details*

![UC-C10 Basic flow: Request details](prototype/UC-C10-Main2-request-details.png)

*UC-C10 - Alternative flow A1: No requests*

![UC-C10 Alternative flow A1: No requests](prototype/UC-C10-A1-no-requests.png)

*UC-C10 - Alternative flow A2: Declined reservation*

![UC-C10 Alternative flow A2: Declined reservation](prototype/UC-C10-A2-declined-reservation.png)

*UC-C10 - Alternative flow A3: Expired reservation*

![UC-C10 Alternative flow A3: Expired reservation](prototype/UC-C10-A3-expired-reservation.png)

*UC-C10 - Alternative flow A4: Cancelled by restaurant*

![UC-C10 Alternative flow A4: Cancelled by restaurant](prototype/UC-C10-A4-cancelled-by-restaurant.png)

*UC-C10 - Alternative flow A7: Service error*

![UC-C10 Alternative flow A7: Service error](prototype/UC-C10-A7-service-error.png)

---

## UC-C11 Cancel Reservation
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

**1. Use-Case Name:** UC-C11 Cancel Reservation

**Actor(s):** Customer

**1.1 Brief Description**

A customer cancels a confirmed reservation at least 2 hours before the reserved time. Extends UC-C10. Realizes FR-5.5.

**2. Flow of Events**

**2.1 Basic Flow**

1. On a confirmed reservation in UC-C10, the customer selects **Cancel**.
2. The system displays the cancellation deadline and a field for the cancellation reason.
3. The customer enters the reason and confirms the cancellation.
4. The system checks that the reservation is still *Confirmed* and that the current time is at least 2 hours before the reserved time.
5. The system changes the state to *Cancelled by customer*, records the time and reason in the status history, and releases the slot capacity.
6. The system displays the reservation with the state *Cancelled by customer*.

**2.2 Alternative Flows**

**2.2.1 A1 - Cutoff passed.** At step 4, if less than 2 hours remain before the reserved time, the system rejects the cancellation, keeps the state *Confirmed*, and displays the restaurant hotline so the customer can contact the restaurant directly.

**2.2.2 A2 - Reservation already in a final state.** At step 4, if the reservation is no longer *Confirmed* (for example, it was cancelled by the restaurant), the system rejects the cancellation and displays the current state.

**2.2.3 A3 - Customer keeps the reservation.** At step 3, the customer selects **Keep Reservation**. The state is unchanged.

**2.2.4 A4 - Storage unavailable.** At step 5, if the change cannot be stored, the system shows a retryable error and the state stays *Confirmed*.

**3. Special Requirements**

- REL-02: the cutoff is checked before, at and after the boundary, and the status change keeps its actor, time and reason.

**4. Preconditions**

- The customer is signed in.
- The reservation belongs to the customer and is in the *Confirmed* state.

**5. Postconditions**

- Success: the reservation is *Cancelled by customer* and the slot capacity is released.
- Failure: the reservation stays *Confirmed*.

**6. Extension Points**

None.

**7. Prototype Screens**

*UC-C11 - Basic flow: Cancel reservation*

![UC-C11 Basic flow: Cancel reservation](prototype/UC-C11-Main1-cancel-reservation.png)

*UC-C11 - Basic flow: Reservation cancelled*

![UC-C11 Basic flow: Reservation cancelled](prototype/UC-C11-Main2-reservation-cancelled.png)

*UC-C11 - Alternative flow A1: Cutoff passed*

![UC-C11 Alternative flow A1: Cutoff passed](prototype/UC-C11-A1-cutoff-passed.png)

*UC-C11 - Alternative flow A2: Final state*

![UC-C11 Alternative flow A2: Final state](prototype/UC-C11-A2-final-state.png)

*UC-C11 - Alternative flow A4: Storage unavailable*

![UC-C11 Alternative flow A4: Storage unavailable](prototype/UC-C11-A4-storage-unavailable.png)

---

## UC-C12 Submit Event Inquiry
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

**1. Use-Case Name:** UC-C12 Submit Event Inquiry

**Actor(s):** Customer

**1.1 Brief Description**

A customer planning a group event submits a structured event brief to a venue. The inquiry follows a clarification and proposal process instead of the ordinary table reservation. Realizes FR-6.1.

**2. Flow of Events**

**2.1 Basic Flow**

1. On the venue page, the customer selects **Plan an Event**.
2. The system displays the event brief form with the fields occasion, party size, preferred date, budget and special needs.
3. The customer completes the form and selects **Submit Inquiry**.
4. The system validates the fields.
5. The system creates the event inquiry, records the first entry of its history, and adds it to the partner dashboard (UC-P05).
6. The system displays the inquiry summary and states that it is an inquiry, not a confirmed booking.

**2.2 Alternative Flows**

**2.2.1 A1 - Customer not signed in.** At step 1, if the user is a guest, the system starts UC-C02 Sign In. After a successful sign-in, the flow continues at step 2.

**2.2.2 A2 - Invalid field.** At step 4, if a required field is empty, the party size is not a positive number, or the preferred date is in the past, the system highlights the field and shows a message. The flow returns to step 3.

**2.2.3 A3 - Storage unavailable.** At step 5, if the inquiry cannot be stored, the system shows a retryable error and keeps the entered data. The flow returns to step 3.

**2.2.4 A4 - Customer leaves the form.** Before step 5, the customer leaves the form. No inquiry is created.

**3. Special Requirements**

- An event inquiry is kept separate from table reservation requests.
- PLAT-01 and A11Y-01 apply to the event brief form.

**4. Preconditions**

- The customer is signed in.
- The venue is approved and published.

**5. Postconditions**

- Success: an event inquiry exists and is visible to the partner and to the customer (UC-C10).
- Failure: no inquiry is created.

**6. Extension Points**

None.

**7. Prototype Screens**

*UC-C12 - Basic flow: Event inquiry form*

![UC-C12 Basic flow: Event inquiry form](prototype/UC-C12-Main1-event-inquiry-form.png)

*UC-C12 - Basic flow: Inquiry submitted*

![UC-C12 Basic flow: Inquiry submitted](prototype/UC-C12-Main2-inquiry-submitted.png)

*UC-C12 - Alternative flow A2: Invalid field*

![UC-C12 Alternative flow A2: Invalid field](prototype/UC-C12-A2-invalid-field.png)

*UC-C12 - Alternative flow A3: Storage unavailable*

![UC-C12 Alternative flow A3: Storage unavailable](prototype/UC-C12-A3-storage-unavailable.png)

---

## UC-C13 Respond to Event Inquiry
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

**1. Use-Case Name:** UC-C13 Respond to Event Inquiry

**Actor(s):** Customer

**1.1 Brief Description**

A customer answers the partner's latest response on an event inquiry: they supply details when the partner requests clarification, or they accept, ask for a revision of, or decline a proposal. Extends UC-C10. Realizes FR-6.3 and FR-6.5.

**2. Flow of Events**

**2.1 Basic Flow**

The flow depends on the partner's latest response.

*Supply clarification*

1. On an event inquiry in UC-C10, the customer selects **Respond**.
2. The system displays the inquiry history and the partner's clarification request.
3. The customer enters the requested details and selects **Send**.
4. The system validates that the answer is not empty, records it in the inquiry history, and returns the inquiry to the partner for review (UC-P07).
5. The system displays the updated inquiry history.

*Accept a proposal*

1. On an event inquiry in UC-C10, the customer selects **Respond**.
2. The system displays the inquiry history and the proposal with its menu, room, price and terms.
3. The customer selects **Accept**.
4. The system records the acceptance in the inquiry history and sends the inquiry to the partner for capacity check and confirmation (UC-P09).
5. The system displays the inquiry with the accepted proposal.

**2.2 Alternative Flows**

**2.2.1 A1 - Ask for a revision.** At step 3 of *Accept a proposal*, the customer selects **Ask for Revision** and enters the requested changes. The system records the request in the inquiry history and returns the inquiry to the partner for review (UC-P07).

**2.2.2 A2 - Decline the proposal.** At step 3 of *Accept a proposal*, the customer selects **Decline**. The system closes the inquiry and retains its history.

**2.2.3 A3 - Inquiry closed by the partner.** At step 2, if the partner closed the inquiry as unavailable, the system displays the partner's explanation and no response is possible.

**2.2.4 A4 - Empty answer.** At step 4 of *Supply clarification*, if the answer is empty, the system shows a message. The flow returns to step 3.

**2.2.5 A5 - Storage unavailable.** At step 4 of either flow, if the response cannot be stored, the system shows a retryable error and keeps the entered text. The flow returns to step 3.

**3. Special Requirements**

- Every message, proposal and decision is kept in the inquiry history in time order.
- An accepted proposal becomes a confirmed event only after the partner checks capacity and confirms it (UC-P09).

**4. Preconditions**

- The customer is signed in.
- The inquiry belongs to the customer and is waiting for the customer's response.

**5. Postconditions**

- Clarification sent: the inquiry is back with the partner for review.
- Proposal accepted: the inquiry waits for the partner's confirmation.
- Revision requested: the inquiry is back with the partner for review.
- Proposal declined: the inquiry is closed and its history retained.

**6. Extension Points**

None.

**7. Prototype Screens**

*UC-C13 - Basic flow: Supply clarification*

![UC-C13 Basic flow: Supply clarification](prototype/UC-C13-Main1-supply-clarification.png)

*UC-C13 - Basic flow: Respond to proposal*

![UC-C13 Basic flow: Respond to proposal](prototype/UC-C13-Main2-respond-to-proposal.png)

*UC-C13 - Basic flow: Proposal accepted*

![UC-C13 Basic flow: Proposal accepted](prototype/UC-C13-Main3-proposal-accepted.png)

*UC-C13 - Alternative flow A1: Ask for revision*

![UC-C13 Alternative flow A1: Ask for revision](prototype/UC-C13-A1-ask-for-revision.png)

*UC-C13 - Alternative flow A2: Proposal declined*

![UC-C13 Alternative flow A2: Proposal declined](prototype/UC-C13-A2-proposal-declined.png)

*UC-C13 - Alternative flow A3: Inquiry closed by restaurant*

![UC-C13 Alternative flow A3: Inquiry closed by restaurant](prototype/UC-C13-A3-inquiry-closed-by-restaurant.png)

*UC-C13 - Alternative flow A4: Empty answer*

![UC-C13 Alternative flow A4: Empty answer](prototype/UC-C13-A4-empty-answer.png)

*UC-C13 - Alternative flow A5: Storage unavailable*

![UC-C13 Alternative flow A5: Storage unavailable](prototype/UC-C13-A5-storage-unavailable.png)

