# Demo Script (10-12 minutes)

Keep this order for a smooth, beginner-friendly walkthrough.

## 1) Setup (1 min)

- Start DB: `docker compose -f docker/docker-compose.yml up -d` (from repo root)
- Start backend: `cd server && dotnet run --project src/SmartEventManagement.API`
- Start client (React): `cd client && npm run dev`

## 2) Home + UX first impression (1 min)

- Show hero and approved event catalogue.
- Mention card-based layout and category filtering.

## 3) Role login tour (1 min)

- Demo accounts:
  - Admin: `admin@koi.edu.au` / `AdminPass123!`
  - Organizer: `organizer@koi.edu.au` / `OrganizerPass123!`
  - Attendee: `attendee@koi.edu.au` / `AttendeePass123!`

## 4) Organizer flow (2 min)

- Login as organizer.
- Show create event form and submit new event.
- Show listing appears as pending in organizer view.
- Show organizer card filters and status badges.

## 5) Admin workflow (2 min)

- Login as admin.
- Open admin review console.
- Add admin note, then approve/reject/pending on sample events.
- Mention this controls what appears in public catalogue.

## 6) Realtime + notifications (1 min)

- Keep organizer/attendee open in another tab.
- Perform admin action and show inbox updates via bell.
- Show merged live activity + notifications panel.

## 7) Attendee flow (2 min)

- Login as attendee.
- Save interest tags.
- Browse recommendations and register for an event.
- Show feedback section and submit/edit feedback.

## 8) Suggestion feature + analytics (1-2 min)

- Attendee submits event suggestion.
- Organizer/Admin sees suggestion card in hub.
- Organizer analytics cards/chart visible.

## 9) Close (30 sec)

- Summarize: all required objectives implemented with clean, understandable architecture and card-based UX.
