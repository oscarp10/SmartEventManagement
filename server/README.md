# Server (.NET API)

Smart Event Management API — ASP.NET Core 9, EF Core, PostgreSQL, JWT, SignalR.

## Run

From this directory (`server/`):

```bash
dotnet run --project src/SmartEventManagement.API
```

## Migrations

From repository root (`SmartEventManagement/`):

```bash
dotnet ef database update --project server/src/SmartEventManagement.API --startup-project server/src/SmartEventManagement.API --context AppDbContext
```

Migrations also apply on API startup (`Database.Migrate()` in `Program.cs`).

## Docs

- [Local backend setup](../docs/BACKEND_GUIDES/LOCAL_BACKEND_SETUP.md)
- [Backend flatten blueprint](../docs/BACKEND_GUIDES/BACKEND_FLATTEN_BLUEPRINT.md)
