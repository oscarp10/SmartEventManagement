# API and Realtime Guide

## Base URLs

- Backend local base: `http://localhost:5000`
- Frontend local base: `http://localhost:5173`

Frontend uses `VITE_API_BASE` to target backend.

## Authentication

- Auth uses JWT Bearer tokens.
- Protected requests include:
  - `Authorization: Bearer <token>`
- JWT settings are configured in backend `appsettings*.json` under `Auth`.

## HTTP Client (Frontend)

Shared client helper lives in `client/src/lib/apiClient.ts`:

- `API_BASE`
- `request(path, options)`
- `parseJson(response)`
- `parseError(response, fallback)`

Feature services wrap this client:

- `features/auth/services/authApi.ts`
- `features/events/services/eventsApi.ts`
- `features/dashboard/services/dashboardApi.ts`
- `features/feedback/services/feedbackApi.ts`
- `features/notifications/services/notificationsApi.ts`
- `features/shared/services/contactApi.ts`

## Realtime

- SignalR hub endpoint: `/hubs/events`
- Backend maps hub in `Program.cs`.
- Frontend notification/realtime hooks connect via the notifications feature.

## Local Verification

1. Start backend.
2. Start frontend.
3. Open app and test login/event flows.
4. Confirm protected calls include token.
5. Confirm realtime notifications update dashboard/inbox where expected.

