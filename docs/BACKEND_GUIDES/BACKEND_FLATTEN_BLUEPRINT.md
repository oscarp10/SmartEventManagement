# Backend Flatten Blueprint (Safe Plan)

Goal: move from layered projects to one API-style project **without losing features**.

## Progress snapshot

- [x] API request/response records extracted out of controllers.
- [x] DTOs split into feature-based files under `SmartEventManagement.API/DTOs/`.
- [x] Entities and enums: folder `SmartEventManagement.API/Models` (+ `Models/Enums`), namespace `SmartEventManagement.API.Models`.
- [x] EF Core: `SmartEventManagement.API/Data` with namespaces `SmartEventManagement.API.Data` and `SmartEventManagement.API.Data.Migrations`.
- [x] Auth + recommendations: folder `SmartEventManagement.API/Services`, namespace `SmartEventManagement.API.Services`.
- [x] Single-project solution: only `SmartEventManagement.API.csproj`; former Domain/Application/Infrastructure projects removed.

## Target style (single project)

```text
server/
  EventHub.API.csproj
  Program.cs
  appsettings.json
  appsettings.Development.json
  Controllers/
  Data/
    AppDbContext.cs
    Migrations/
  DTOs/
  Models/
  Services/
  Properties/
```

## Effective mapping (after merge)

- **Entities / enums on disk:** `SmartEventManagement.API/Models/` and `Models/Enums/`
- **Persistence:** `SmartEventManagement.API/Data/` and `Data/Migrations/`
- **Services:** `SmartEventManagement.API/Services/Auth/`, `Services/Recommendations/`
- **HTTP:** `SmartEventManagement.API/Controllers/`, `Hubs/`

## Required order (to avoid breakage)

1. Copy files into target folders (no behavior changes first).
2. Update namespaces/imports.
3. Merge package references into one `.csproj`.
4. Keep migration history table and migration classes unchanged.
5. Build and run regression checks after each batch.

## Risks to watch

- Namespace mismatch breaking DI registration.
- EF migration namespace/path drift.
- Accidental change to authorization attributes on controllers.
- Service lifetime changes when merging Program registrations.

## Status

Merge complete. Use `dotnet ef` with `--project` and `--startup-project` both pointing at `SmartEventManagement.API` (see `LOCAL_BACKEND_SETUP.md`).
