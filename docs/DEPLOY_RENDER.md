# Deploying SmartEventManagement on Render (API + Postgres + Static Site)

This repo deploys to Render as **three** resources:

- **PostgreSQL**: `smart-event-db` (managed database)
- **Web Service (Docker)**: the **.NET API** (from `server/`)
- **Static Site**: the **React UI** (from `client/`)

## Why Render shows “1 active service”

On Render free tier, the **API Web Service can spin down when idle** (scale-to-zero). When it’s sleeping, Render may show it as not active until a request wakes it up.

The **Static Site** is always “active” because it’s just static files served by Render’s CDN.

To wake the API, open:

- `https://<your-api-service>.onrender.com/api/events`

If it returns JSON, the API is up.

## 1) Create Postgres

Create a Postgres instance in the **same region** as your API service.

You’ll use its connection info to set:

- `ConnectionStrings__LocalPostgres` on the **API Web Service**

## 2) Create the API (Web Service, Docker)

Render doesn’t run .NET as a native runtime for web services; deploy the API using **Docker**.

Service settings:

- **Language/Runtime**: Docker
- **Region**: same as Postgres
- **Branch**: `main`
- **Root Directory**: `server`
- **Dockerfile Path**: `Dockerfile` (inside `server/`)

Environment variables to set on the API Web Service:

- `ASPNETCORE_ENVIRONMENT=Production`
- `Auth__JwtSecret=<long random secret>`
- `ConnectionStrings__LocalPostgres=<Npgsql connection string to Render Postgres>`
- `Cors__AllowedOrigins=<frontend origin(s)>` (set after the static site exists)

Example Npgsql connection string format:

```text
Host=<host>;Port=5432;Database=<db>;Username=<user>;Password=<password>;SSL Mode=Require
```

## 3) Create the UI (Static Site)

Static site settings:

- **Root Directory**: `client`
- **Build Command**: `npm ci && npm run build`
- **Publish Directory**: `dist`

Environment variable on the Static Site:

- `VITE_API_BASE=https://<your-api-service>.onrender.com`

Important: this is baked into the Vite build output. Changing it requires a new static deploy.

## 4) Finish CORS

After your Static Site deploys, copy its URL exactly (origin only, no path), e.g.

`https://<your-static-site>.onrender.com`

Set on the API Web Service:

- `Cors__AllowedOrigins=https://<your-static-site>.onrender.com`

If you have multiple frontend URLs, comma-separate them:

```text
https://site-a.onrender.com,https://site-b.onrender.com
```

## 5) Quick verification checklist

- **API**: `GET /api/events` returns JSON
- **UI**: static site loads
- **UI → API calls**: no CORS errors in browser console

