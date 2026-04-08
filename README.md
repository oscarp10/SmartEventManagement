# Smart Event Management

Professional web application for King's Own Institute: event catalog, role-based dashboards (Admin, Organizer, Attendee), JWT auth, PostgreSQL, SignalR activity, and organizer analytics.

---

## Repository structure (current)

Layout under `SmartEventManagement/` follows a **client / server / docs / docker** monorepo style.

```text
SmartEventManagement/
├── README.md                          # This file
│
├── docker/
│   └── docker-compose.yml             # Local PostgreSQL
│
├── docs/                              # Documentation
│   ├── DEMO_SCRIPT.md
│   ├── MANUAL_TEST_RUN_SHEET.md
│   ├── OBJECTIVE_MATRIX.md
│   ├── PHASE1_REPORT.md
│   ├── QA_CHECKLIST.md
│   └── BACKEND_GUIDES/
│       ├── BACKEND_FLATTEN_BLUEPRINT.md
│       └── LOCAL_BACKEND_SETUP.md
│
├── server/                            # .NET 9 API
│   ├── SmartEventManagement.sln
│   ├── README.md
│   ├── tests/                         # Test project / future tests
│   └── src/
│       └── SmartEventManagement.API/
│           ├── Program.cs
│           ├── appsettings.json
│           ├── appsettings.Development.json
│           ├── SmartEventManagement.API.csproj
│           ├── Properties/
│           ├── Controllers/
│           ├── DTOs/
│           ├── Data/
│           │   ├── AppDbContext.cs
│           │   ├── DbSeeder.cs
│           │   └── Migrations/
│           ├── Hubs/
│           │   └── EventUpdatesHub.cs
│           ├── Models/
│           │   └── Enums/
│           └── Services/
│               ├── Auth/
│               └── Recommendations/
│
└── client/                            # React + Vite + TypeScript + Tailwind
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json / tsconfig.*.json
    ├── index.html
    ├── public/
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── app-types.ts
        ├── config/
        │   └── site.ts
        ├── constants/
        │   └── attendeeInterests.ts
        ├── types/
        │   └── app-models.ts
        ├── lib/
        ├── layouts/
        │   └── PublicContent.tsx
        ├── pages/
        │   ├── HomePage.tsx, AboutPage.tsx, ContactPage.tsx, SupportPage.tsx
        │   ├── LoginPage.tsx, SignupPage.tsx
        │   └── dashboard/
        │       ├── DashboardPageBody.tsx
        │       ├── DashboardSharedSections.tsx
        │       ├── admin/AdminApprovalsSection.tsx
        │       ├── organizer/
        │       └── attendee/AttendeeDashboardSections.tsx
        ├── components/
        │   ├── Navigation.tsx, Footer.tsx, HomeExplore.tsx
        │   ├── layout/DashboardShell.tsx
        │   ├── marketing/HeroSection.tsx
        │   ├── auth/, ui/, dashboard/, admin/, organizer/
        ├── assets/
        └── styles/
```

**Generated output** (do not commit as source; ignored via root `.gitignore` and `client/.gitignore`): `client/dist/`, `**/bin/`, `**/obj/`.

---

## Architecture map

- **Server** (`server/src/SmartEventManagement.API`): ASP.NET Core — REST controllers, EF Core, JWT auth, SignalR hub, DTOs, services.
- **Client root** (`client/src/App.tsx`): Cross-cutting state (auth, data loads, SignalR), page routing, dashboard wiring.
- **Pages** (`client/src/pages/`): Marketing, auth, and `dashboard/` modules per role (composed by `DashboardPageBody.tsx`).
- **Dashboard shell** (`client/src/components/layout/DashboardShell.tsx`): Role-aware chrome; body comes from `DashboardPageBody`.

---

## Current status (snapshot)

- .NET 9 API with PostgreSQL, EF Core migrations (applied on startup), seeded users and sample data.
- JWT + roles: Admin, Organizer, Attendee.
- SignalR hub for approvals, capacity, and targeted notifications.
- React UI: marketing pages, auth, role-specific dashboards, organizer analytics (Recharts), admin approvals, attendee recommendations and registrations.

---

## Local database (PostgreSQL)

From **repository root** (`SmartEventManagement/`):

```bash
docker compose -f docker/docker-compose.yml up -d
```

Or:

```bash
cd docker && docker compose up -d
```

Defaults (see `appsettings`):

- Host: `localhost`, port `5432`
- Database: `smart_event_management`
- User / password: `postgres` / `postgres`

---

## Run the application

**API**

```bash
cd server
dotnet run --project src/SmartEventManagement.API
```

**Web UI**

```bash
cd client
npm install
npm run dev
```

Manual migration (if needed), from **repository root**:

```bash
dotnet ef database update --project server/src/SmartEventManagement.API --startup-project server/src/SmartEventManagement.API --context AppDbContext
```

More detail: [docs/BACKEND_GUIDES/LOCAL_BACKEND_SETUP.md](docs/BACKEND_GUIDES/LOCAL_BACKEND_SETUP.md).

---

## Auth and API endpoints

- `POST /api/auth/register` — create profile with password hash and return JWT
- `POST /api/auth/login` — email + password login and return JWT
- `GET /api/recommendations/{attendeeId}` — personalized recommended events
- `POST /api/registrations` — attendee registers for an approved event (JWT must match attendee id)
- `GET /api/registrations/me` — attendee registrations (includes event summary fields)
- `PATCH /api/registrations/{id}/status` — update registration status (role-scoped)
- `GET /api/registrations/organizer/{organizerId}` — organizer view of registrations for their events
- `GET /api/notifications/me` — list notifications for the authenticated user
- `PATCH /api/notifications/{id}/read` — mark a notification read (self or admin)
- `POST /api/feedback` — submit feedback for an event you registered for (after event time)
- `GET /api/feedback/me` — list feedback submitted by the authenticated attendee
- `GET /api/analytics/organizer/{organizerId}` — organizer analytics (registrations, engagement, ratings)
- Admin event workflow:
  - `POST /api/events/{id}/approve`
  - `POST /api/events/{id}/reject` (optional reason)
  - `POST /api/events/{id}/pending` (move back to pending review)
- SignalR hub: `/hubs/events` (send JWT via `accessTokenFactory` from the client)
  - `EventApproved` broadcast on admin approval
  - `EventRejected` / `EventMarkedPending` for admin workflow
  - `EventCapacityUpdated` on registration changes
  - `NotificationCreated` targeted to `user:{userId}` when notifications are created via API

Sample register payload:

```json
{
  "fullName": "Alex Chen",
  "email": "alex@koi.edu.au",
  "password": "StrongPass123!",
  "role": "Attendee",
  "interests": ["tech", "networking"]
}
```

Sample login payload:

```json
{
  "email": "alex@koi.edu.au",
  "password": "StrongPass123!"
}
```

---

## Demo accounts (seeded)

- Admin: `admin@koi.edu.au` / `AdminPass123!`
- Organizer: `organizer@koi.edu.au` / `OrganizerPass123!`
- Attendee: `attendee@koi.edu.au` / `AttendeePass123!`

---

## Next steps (ideas)

- Expand `server/tests/` with API integration tests; add client tests for critical UI flows.
- Optional: `.vscode/` tasks for `client` + `server`.
- Optional: code-split heavy dashboard chunks to shrink the main bundle.
