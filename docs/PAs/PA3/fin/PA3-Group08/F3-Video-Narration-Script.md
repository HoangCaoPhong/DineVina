# PA3 F3 Narrated Demo Guide
**Performed by:** Nguyễn Trung Kiên and Hoàng Cao Phong | **Reviewed by:** Trương Khánh Duy | **Edited by:** Hoàng Cao Phong

## Demonstration scope
**Performed by:** Nguyễn Trung Kiên and Hoàng Cao Phong | **Reviewed by:** Trương Khánh Duy | **Edited by:** Hoàng Cao Phong

The YouTube demo is a 6 minute 30 second demonstration for Functional Group F3: restaurant discovery and venue details. The current local build uses a React frontend, FastAPI backend and SQLAlchemy persistence. The repository has a PostgreSQL deployment configuration; the initial browser smoke check used SQLite; a later backend suite also passed against local PostgreSQL 17. Other account, reservation, event and AI controls in the prototype are illustrative and are not claimed as completed PA3 functional groups.

## Narration outline
**Performed by:** Nguyễn Trung Kiên and Hoàng Cao Phong | **Reviewed by:** Trương Khánh Duy | **Edited by:** Hoàng Cao Phong

1. Introduce the PA3 goal and identify F3 as the implemented full-stack group.
2. Show the Spec Kit `spec.md`, `plan.md` and `tasks.md` for `002-f3-venue-discovery` and connect the user stories to the search and detail endpoints.
3. Show the sample-data fixture and database model. Explain that only venues with `status == "approved"` may appear in public search and detail responses.
4. Start the local API and web app. Search or filter venues, open a venue detail panel, and show menu and location fields returned by the API.
5. Show an empty result and an API failure state. The frontend does not silently replace a failed API response with a hard-coded discovery list.
6. Run `ruff check backend`, `pytest -q` and `npm run build`. The local verification on 14 November returned 25 passed and 2 skipped tests, plus successful lint and frontend build. The two skipped checks require live Supabase access and must not be described as passed.
7. Close with the known limits: local browser smoke testing used SQLite; live PostgreSQL/Supabase verification needs separate evidence.

## Video and publication record
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Trương Khánh Duy | **Edited by:** Hoàng Cao Phong

- Duration: approximately 6 minutes 30 seconds. The original MP4 is retained outside the submission package; the course asks for the YouTube link.
- YouTube Unlisted URL: https://youtu.be/zDdyh3pvxeM
- Publication date and account: 14 November 2026, Brian Adamant Hopeless.
- Verification: the watch page played the uploaded video; YouTube's public oEmbed endpoint returned the expected title. A watch-page screenshot is in `evidence/YouTube-Unlisted-Playback.jpg`.
