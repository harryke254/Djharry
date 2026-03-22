# Workspace

## Overview

DJ Shinski mixtape website with a public-facing site and admin dashboard.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite (Tailwind CSS, shadcn/ui, React Query, Framer Motion)
- **Object Storage**: Replit App Storage (Google Cloud Storage, presigned URL uploads)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── dj-site/            # React + Vite DJ mixtape website
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Features

### Public Site (`/`)
- Homepage hero with DJ Shinski branding, featured mixtapes
- Mixtapes gallery (`/mixtapes`) with cover art, genre, description
- Individual mixtape page (`/mixtapes/:id`) with audio player and tracklist
- Download button support
- Dark cinematic aesthetic

### Admin Dashboard (`/admin`)
- Simple password-protected admin login (password: `djshinski2024`)
- Dashboard listing all mixtapes with edit/delete actions
- Upload new mixtape form (`/admin/upload`):
  - Title, description, genre, tracklist, featured, release date
  - Cover image uploader (any image, via GCS presigned URLs)
  - Audio file uploader (up to 500MB, via GCS presigned URLs)
- Edit mixtape form (`/admin/edit/:id`)

### API Endpoints
- `GET /api/mixtapes` — list mixtapes (supports `?genre=`, `?limit=`, `?offset=`)
- `POST /api/mixtapes` — create mixtape
- `GET /api/mixtapes/:id` — get single mixtape
- `PUT /api/mixtapes/:id` — update mixtape
- `DELETE /api/mixtapes/:id` — delete mixtape
- `POST /api/storage/uploads/request-url` — get presigned GCS URL for upload
- `GET /api/storage/objects/*` — serve uploaded files (audio, images)

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all lib packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — only emit `.d.ts` files during typecheck

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server with mixtape routes and object storage.

### `artifacts/dj-site` (`@workspace/dj-site`)

React + Vite frontend. Dark music aesthetic with Tailwind CSS, shadcn/ui components.

### `lib/db` (`@workspace/db`)

Database schema: `mixtapesTable` (id, title, description, genre, coverImagePath, audioPath, tracklistText, downloadCount, featured, releaseDate, createdAt, updatedAt)

Run migrations: `pnpm --filter @workspace/db run push`

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec. Run codegen: `pnpm --filter @workspace/api-spec run codegen`
