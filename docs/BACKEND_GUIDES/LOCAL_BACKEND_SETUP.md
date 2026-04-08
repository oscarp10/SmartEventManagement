# Local Backend Setup (PostgreSQL)

This is the fastest path for local development.

## 1) Start database

From repository root (`SmartEventManagement/`):

```bash
docker compose -f docker/docker-compose.yml up -d
```

## 2) Run migrations

From `server/`:

```bash
dotnet ef database update --project src/SmartEventManagement.API --startup-project src/SmartEventManagement.API --context AppDbContext
```

## 3) Run API

```bash
dotnet run --project src/SmartEventManagement.API
```

## 4) Verify key endpoints

- `GET http://localhost:5000/api/events`
- `POST http://localhost:5000/api/auth/login`
- `GET http://localhost:5000/api/notifications/me` (JWT required)

## Notes

- The API also calls `Database.Migrate()` on startup, but explicit migration runs are clearer for debugging.
- Current newer migrations often pending on a fresh DB:
  - `AddFeedbackAndRejectionReason`
  - `AddEventAdminCommentRegistrationsOpen`
  - `AddEventSuggestions`
