# Product Scope (Working Draft)

## Problem and users

Customers need a convenient way to discover a suitable restaurant, understand its menu, and confirm a table or event request. Restaurant partners need a controlled way to publish their venue and manage incoming demand. The first delivery targets a responsive web application; mobile-native clients are out of scope for now.

## Actors

- **Customer:** searches restaurants, views details and menus, reserves a table, and requests event services.
- **Restaurant partner:** registers a venue and maintains menus, availability, promotions, and booking requests.
- **Platform admin:** reviews partner onboarding and handles moderation/support (planned).

## Functional groups (proposed: 9)

| # | Group | Core use cases | Priority |
| --- | --- | --- | --- |
| 1 | Accounts and profiles | Register, sign in, edit profile, partner roles | MVP |
| 2 | Restaurant onboarding | Submit venue details, review/approve listing | MVP |
| 3 | Discovery | Search, filter, sort, view restaurant details | MVP |
| 4 | Menus | Partner edits dishes/prices; customer browses menu | MVP |
| 5 | Table reservations | Choose slot/party size, request/cancel, partner confirms | MVP |
| 6 | Event booking | Submit event brief, partner quotes/accepts, track status | Next |
| 7 | Availability and partner dashboard | Manage opening hours, capacity, incoming requests | MVP |
| 8 | Promotions and editorial | Publish eligible offers and dining content | Next |
| 9 | Intelligent assistance | Personalized recommendations and conversational discovery | Next |

These are functional groups, not screen counts. The PA1 proposal should expand each into short user-value paragraphs and confirm scope with the TA.

## AI delivery order

1. **Meaningful first AI feature:** restaurant recommendation based on expressed preferences and venue attributes, with visible reasons for suggestions. Define an offline evaluation set before launch.
2. **RAG assistant:** answers customer questions from verified restaurant, menu, and policy data; shows source links and falls back when information is absent.
3. **Menu OCR:** extracts dish name, price, and description from partner images/PDFs into an editable draft. Partner approval is required before publishing.
4. **Visual food search:** retrieves similar dishes from user-provided food images after enough labeled menu imagery exists. Treat as exploratory until dataset quality is measured.

Full SME management (revenue, inventory, tax) is outside current scope. Payment handling is also deferred until booking rules, cancellation policy, and regulatory requirements are defined.

## Comparable products to survey

- [PasGo](https://pasgo.vn/)
- [Foody](https://www.foody.vn/)

The team must capture current screenshots, user flows, and a feature comparison for PA1; this list is only a survey starting point.
