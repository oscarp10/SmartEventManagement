# Architecture Overview

## High-Level

- **Client**: React SPA (Vite), feature-based architecture under `client/src/features`.
- **Server**: ASP.NET Core Web API with EF Core/PostgreSQL.
- **Realtime**: SignalR hub at `/hubs/events`.

## Frontend Design

- `app/`: top-level app routing entry.
- `features/`: domain modules (`auth`, `events`, `dashboard`, `feedback`, `notifications`, `shared`).
- `lib/`: cross-feature utilities (HTTP client and adapters).
- `@/` alias for absolute imports.

Feature modules use local hooks/services/types and expose public API via `index.ts` barrels.

## Backend Design

- Controllers expose REST endpoints.
- Services contain business logic.
- EF Core DbContext handles persistence.
- JWT authentication secures protected endpoints.
- CORS allows local frontend origins and configured extras.

## Data Flow

1. Frontend calls feature service.
2. Service uses shared API client (`request`, `parseJson`, `parseError`).
3. API validates/authenticates and persists via EF Core.
4. Realtime updates are pushed through SignalR where applicable.

## Non-Functional Notes

- Type-safe frontend (`tsc -b` in build).
- Swagger in development for backend API visibility.
- Migrations and seed on backend startup for local bootstrap.

