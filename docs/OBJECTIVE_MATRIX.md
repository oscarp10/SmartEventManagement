# Objective Matrix (KOI Smart Event Management)

Use this table in report/presentation to show objective coverage clearly.

| Objective | Implemented In | How to Verify |
|---|---|---|
| Scalable responsive web app | `client/src`, `server/src` | Run client + server; test desktop/mobile widths |
| User roles (Admin/Organizer/Attendee) | `server/src/SmartEventManagement.API/Controllers/AuthController.cs`, role checks across controllers | Login as seeded role accounts and confirm role-specific dashboard |
| Real-time event updates | `server/src/SmartEventManagement.API/Hubs/EventUpdatesHub.cs`, SignalR handlers in `client/src/App.tsx` | Keep two sessions open; perform admin approval and observe organizer/attendee updates |
| AI/ML style recommendations | `server/src/SmartEventManagement.API/Services/Recommendations/RecommendationService.cs`, attendee rec UI in `client/src/App.tsx` | Set attendee interests and confirm personalized recommendation cards |
| Organizer analytics dashboard | `server/src/SmartEventManagement.API/Controllers/AnalyticsController.cs`, cards/chart in `client/src/App.tsx` | Organizer login shows totals + monthly bars |
| Notifications + scheduling | Notifications APIs + global inbox in `client/src/components/dashboard/NotificationsPanel.tsx`; calendar in `DashboardMonthCalendar.tsx` | Trigger notifications and open bell; use calendar tab and event details |
| Event creation workflow | `EventsController.cs`, organizer create form in `client/src/App.tsx` | Organizer creates event and sees pending status |
| Admin approval before public listing | `EventsController.cs` approve/reject/pending endpoints + admin console cards | Approve/reject event and verify home page only shows approved events |
| Attendee registration | `RegistrationsController.cs`, attendee register/cancel buttons in dashboard | Register/cancel event and verify counts/messages |
| Feedback system | `FeedbackController.cs`, attendee feedback card in dashboard | Submit/edit/remove feedback after attended event |
| Attendee interest tags + recommendation input | `client/src/constants/attendeeInterests.ts`, interests card in `App.tsx` | Save tags and observe recommendations update |
| Attendee event suggestion to organizers | `EventSuggestionsController.cs`, attendee suggest form + organizer/admin ideas card | Submit suggestion as attendee, view in organizer/admin hub |

## Notes

- Database is local PostgreSQL (`docker/docker-compose.yml`) with EF migrations.
- No Supabase dependency is required for `SmartEventManagement`.
