# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

MyKondateApp ("kondate" = Japanese for meal plan) is a full-stack recipe management app with real-time updates. It consists of:
- **MyApi** — ASP.NET Core 10 Web API (C#) with SQLite via EF Core and SignalR
- **MyClient** — React 19 + TypeScript SPA built with Vite

## Running the App

Both servers must run concurrently in development. Vite proxies API and SignalR requests to the .NET backend.

**Backend** (runs on `http://localhost:5109`):
```sh
cd MyApi
dotnet run
```

**Frontend** (runs on `http://localhost:5173`):
```sh
cd MyClient
npm run dev
```

**Lint frontend:**
```sh
cd MyClient
npm run lint
```

**EF Core migrations** (run from `MyApi/`):
```sh
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

Swagger UI is available at `http://localhost:5109/swagger` in Development.

## Architecture

### API (`MyApi/`)

- `Program.cs` — wires up EF Core (SQLite `kondatte.db`), SignalR hub, CORS (allows `localhost:5173`), Swagger, and static file serving
- `Controllers/RecipeController.cs` — REST endpoints at `/api/recipe`; after each mutating operation it broadcasts a SignalR event to all clients
- `Hubs/RecipeHub.cs` — empty hub class; the server only pushes, clients only receive
- `Models/Recipe.cs` — entity with `Id`, `Name`, `Ingredients`, `Instructions`, `ImagePath` (nullable filename, not full path)
- `Models/RecipeUploadDto.cs` — form-data DTO for create; uses `IFormFile?` for the optional image
- `Data/AppDbContext.cs` — single `DbSet<Recipe>`
- `wwwroot/images/` — uploaded recipe images stored here; served as static files at `/images/<filename>`; file size limit is 5 MB

SignalR events emitted by the server: `RecipeCreated` (payload: full Recipe), `RecipeUpdated` (payload: full Recipe), `RecipeDeleted` (payload: int id).

### Client (`MyClient/src/`)

- `main.tsx` — React root wrapped in `BrowserRouter`
- `App.tsx` — top-level nav and `Routes`; currently only `/recipes` is active
- `pages/RecipeListPage.tsx` — fetches all recipes on mount, renders `RecipeForm` and a list of `RecipeCard`s; connects to SignalR to handle live additions/deletions
- `hooks/useSignalR.ts` — reusable hook; takes a hub URL and event list; keeps `events` out of the `useEffect` dependency array to avoid reconnecting on every render
- `components/RecipeForm.tsx` — modal dialog (`<dialog>` element) for creating a recipe; calls parent `onSubmit` with raw field values (no Zod validation wired up yet)
- `components/recipeSchema.ts` — Zod schema for `RecipeInput`; not yet connected to `RecipeForm`
- `components/RecipeCard.tsx` — displays a recipe; delete button calls `DELETE /api/recipe/:id` directly; deletion is reflected in real-time via the `RecipeDeleted` SignalR event
- `api/recipe-api.ts` — thin wrapper around `POST /api/recipe/upload`

Image URLs are constructed as `http://localhost:5109/images/<imagePath>`. The `imagePath` field on a recipe is the stored filename only (e.g. `abc123.jpg`), not a path.

Vite dev server proxies `/api` and `/hubs` to the .NET backend — if you see 404s in dev, check `vite.config.ts` proxy settings.
