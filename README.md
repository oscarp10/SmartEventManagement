# Smart Event Management

Smart Event Management is a full-stack event platform with a React + Vite client and an ASP.NET Core Web API backend.

## Project Structure

```text
SmartEventManagement/
├── client/                  # React + Vite + TypeScript frontend
├── server/                  # ASP.NET Core Web API + EF Core + PostgreSQL
├── docs/                    # Architecture and API docs
├── docker/                  # Container-related assets
└── README.md
```

## Quick Start

### 1) Start backend

```bash
cd server
dotnet restore
dotnet run --project src/SmartEventManagement.API
```

Backend default URL: `http://localhost:5000` (Swagger redirects from `/` in development).

### 2) Start frontend

```bash
cd client
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`.

If backend runs on a different URL, set:

```bash
VITE_API_BASE=http://localhost:5000
```

## Documentation Map

- Frontend guide: `client/README.md`
- Backend guide: `server/README.md`
- Architecture: `docs/ARCHITECTURE.md`
- API and realtime guide: `docs/API_GUIDE.md`

## Validation Commands

### Frontend

```bash
cd client
npm run lint
npm run build
```

### Backend

```bash
cd server
dotnet build SmartEventManagement.sln
```

