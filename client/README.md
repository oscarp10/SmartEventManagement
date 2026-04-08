# Client Guide

This is the React frontend for Smart Event Management.

## Stack

- React 19
- Vite 8
- TypeScript 6
- Tailwind CSS

## Source Layout

```text
client/
├── src/
│   ├── app/                 # App routing entry
│   ├── features/            # Feature-based modules (auth, events, dashboard, etc.)
│   ├── components/          # Shared non-feature UI blocks
│   ├── lib/                 # Cross-cutting helpers (API client, adapters)
│   ├── config/              # Site constants/config
│   ├── constants/           # Static constants
│   ├── layouts/             # Layout wrappers
│   ├── assets/              # Static assets
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── tsconfig*.json
```

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Environment

- `VITE_API_BASE` (optional): backend base URL.
- Default fallback: `http://localhost:5000`.

## Import Convention

- Use absolute aliases: `@/`
- Prefer feature barrels: `@/features/<feature>`
- Avoid deep relative imports.

