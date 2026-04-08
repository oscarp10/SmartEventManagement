# QA Checklist (Beginner Friendly)

Use this before demo/submission.

## 1) Auth and Roles

- [ ] Login works for Admin / Organizer / Attendee. (manual)
- [ ] Wrong password shows error. (manual)
- [ ] Logout clears session and returns to home. (manual)

## 2) Home / Approved Catalogue

- [ ] Home hero loads quickly. (manual)
- [x] Approved events appear directly under hero.
- [x] Category filter changes event list.
- [x] Event cards open details for anonymous users; register action routes to login.

## 3) Admin Approval Flow

- [ ] Admin can set event to `Approved`. (manual)
- [ ] Admin can set event to `Rejected` with reason. (manual)
- [ ] Admin can move event back to `Pending`. (manual)

## 4) Organizer Sync

- [x] Organizer sees pending/approved/rejected badges correctly.
- [ ] Organizer list updates after admin status changes. (manual realtime multi-session check)
- [x] Admin note and rejection reason are visible to organizer.

## 5) Attendee Features

- [ ] Interest tags save correctly. (manual)
- [ ] Recommendation cards load. (manual)
- [ ] Event registration and withdrawal work. (manual)
- [ ] Feedback create/edit/delete works. (manual)

## 6) Notifications / Realtime

- [x] Header bell opens global inbox on all pages.
- [x] Realtime feed lines appear inside inbox panel.
- [ ] Mark-as-read updates unread count. (manual)

## 7) Event Suggestions

- [ ] Attendee can submit suggestion. (manual)
- [ ] Organizer/Admin can view suggestion list. (manual)

## 8) Build Checks

- [x] `client`: `npm run build` passes.
- [x] `server`: `dotnet build SmartEventManagement.sln` passes (run from `server/`).
- [x] DB migrations applied (`dotnet ef database update`).
