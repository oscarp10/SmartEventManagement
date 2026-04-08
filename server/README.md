# Server Guide

This is the ASP.NET Core Web API backend for Smart Event Management.

## Stack

- .NET 9 Web API
- Entity Framework Core
- PostgreSQL (Npgsql provider)
- JWT authentication
- SignalR for realtime updates
- Swagger/OpenAPI (development)

## Structure

```text
server/
├── SmartEventManagement.sln
└── src/
    └── SmartEventManagement.API/
        ├── Controllers/
        ├── Data/
        ├── Hubs/
        ├── Models/
        ├── Services/
        ├── Program.cs
        ├── appsettings.json
        └── appsettings.Development.json
```

## Commands

```bash
dotnet restore
dotnet build SmartEventManagement.sln
dotnet run --project src/SmartEventManagement.API
```

## Configuration

In `appsettings*.json`:

- `ConnectionStrings:LocalPostgres`
- `Auth:Issuer`
- `Auth:Audience`
- `Auth:JwtSecret`
- `Cors:AllowedOrigins` (comma-separated optional extras)

## Runtime Notes

- Migrations are applied on startup.
- Seed data runs on startup.
- In development, `/` redirects to `/swagger`.
- SignalR hub route: `/hubs/events`.

