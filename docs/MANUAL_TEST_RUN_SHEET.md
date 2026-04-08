# 5-7 Minute Manual Test Run Sheet

Use this to close remaining `(manual)` items in `QA_CHECKLIST.md`.

## Pre-start (30 sec)

- Backend running: `cd server && dotnet run --project src/SmartEventManagement.API`
- Frontend running: `cd client && npm run dev`
- Use two browser windows/tabs for realtime checks:
  - Window A: Admin
  - Window B: Organizer (and Attendee after)

## 1) Auth + basic UX (1 min)

1. Open app home.
2. Login as Admin (`admin@koi.edu.au` / `AdminPass123!`) -> expect Admin hub.
3. Logout -> expect return to home.
4. Try wrong password once -> expect auth error message.

Mark in checklist:
- Login works
- Wrong password shows error
- Logout returns home

## 2) Admin approval flow + organizer sync (2 min)

1. Window B: login as Organizer.
2. Organizer creates a test event (or use existing pending one).
3. Window A: Admin opens review console.
4. Set event to Approved -> verify organizer card status updates.
5. Set same event to Rejected with reason -> verify organizer sees rejection reason.
6. Set back to Pending -> verify organizer status badge updates.

Mark in checklist:
- Admin approve/reject/pending
- Organizer list updates after admin status changes

## 3) Attendee core flow (2 min)

1. Open new tab/window and login as Attendee (`attendee@koi.edu.au` / `AttendeePass123!`).
2. In attendee dashboard:
   - Save interest tags.
   - Open recommendation cards.
3. Register for an approved event.
4. Open details card and click **Withdraw registration**.
5. For a past/eligible event, create feedback, then edit and delete feedback.

Mark in checklist:
- Interest tags save
- Recommendation cards load
- Registration/withdraw works
- Feedback create/edit/delete works

## 4) Notifications + suggestions (1-2 min)

1. In any authenticated page, click header bell -> global inbox opens.
2. Trigger an action that creates notification (approve/register) and verify:
   - live activity appears in inbox
   - unread count changes
   - mark one item as read and verify count updates
3. As attendee: submit event suggestion.
4. As organizer/admin: open suggestions section and confirm it appears.

Mark in checklist:
- Mark-as-read updates unread count
- Attendee suggestion submit
- Organizer/admin suggestion list

## Done criteria

If all above pass, remaining manual checks in `QA_CHECKLIST.md` can be marked `[x]`.
