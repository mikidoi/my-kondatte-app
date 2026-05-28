# MyKondateApp Copilot Instructions

## Build, test, and lint commands

### Backend (`MyApi/`)

- Build from the repository root: `dotnet build MyKondateApp.sln`
- Run locally from `MyApi/`: `dotnet run`
- EF Core migrations are managed from `MyApi/`:
  - `dotnet ef migrations add <MigrationName>`
  - `dotnet ef database update`

### Frontend (`MyClient/`)

- Install dependencies from `MyClient/`: `npm install`
- Run the dev server from `MyClient/`: `npm run dev`
- Build from `MyClient/`: `npm run build`
- Lint from `MyClient/`: `npm run lint`

### Tests

- There is currently no automated .NET test project or JavaScript test runner configured in this repository.
- There is no single-test command yet because no automated test suite exists.

## High-level architecture

- This repository is a two-project app:
  - `MyApi/` is an ASP.NET Core 10 API backed by SQLite via EF Core.
  - `MyClient/` is a React 19 + Vite SPA.
- The frontend and backend run separately in development. `MyClient/vite.config.js` proxies `/api`, `/hubs`, and `/images` to the backend on port `5109`, so client code should normally use relative URLs.
- `MyApi/Program.cs` is the main backend composition point: it reads `DB_PATH` for the SQLite file location, applies EF Core migrations on startup, enables CORS for the Vite dev server, serves static files, maps the SignalR hub at `/hubs/recipe`, and maps controller routes.
- `MyApi/Controllers/RecipeController.cs` owns the main backend workflow: recipe CRUD, category lookup, and `/api/recipe/scan` for Gemini-powered recipe extraction. Uploaded files are stored in `MyApi/wwwroot/images/`, and persisted image data is just the stored filename.
- React routes are defined in `MyClient/src/App.tsx`:
  - `/` → `WeeklyMenuPage`, a UI-only weekly planner that keeps its state entirely on the client
  - `/recipes` → `RecipeListPage`, which fetches recipes and categories, opens `CreateRecipeDialog`, and listens for SignalR recipe events
  - `/recipes/:id` → `RecipeDetailPage`, which fetches a single recipe, opens `EditRecipeDialog`, and derives interactive ingredient/step views from the stored text fields
- The recipe UI is split by responsibility rather than a single page file: dialogs in `src/components/`, route-level data fetching in `src/pages/`, responsive shells in `src/components/layout/`, and a shared SignalR hook in `src/hooks/useSignalR.ts`.

## Key conventions

- Recipe create and update flows use `multipart/form-data`, not JSON, because image upload is part of the same requests. On the client, payloads are assembled with `FormData`, and the file field name is `file`.
- Categories are modeled on the backend as a collection (`Recipe.Categories`, `RecipeUploadDto.Categories`, `RecipeEditDto.Categories`). When sending create or update requests, use repeated `categories` form fields rather than a JSON array string.
- Category handling is mid-migration across the stack: the backend uses category collections, but parts of the frontend still use singular `category` fields and assumptions. Category-related changes usually require coordinated updates across API models, DTO binding names, client types, filters, scan results, and edit/create dialogs.
- Ingredients and instructions are stored as newline-delimited text, not structured JSON. The dialogs and detail page rely on a shared text format:
  - ingredient group headers are written as `[Group Name]`
  - instructions are stored as numbered lines like `1. Step text`
  - `RecipeDetailPage` parses those strings to group ingredients and rescale amounts by serving count
- Real-time updates are wired through SignalR at `/hubs/recipe`. The shared `useSignalR` hook intentionally keeps the `events` array out of the `useEffect` dependency list to avoid reconnecting on every render.
- The scan flow is backend-driven: `CreateRecipeDialog` sends an image to `/api/recipe/scan`, and the API calls Gemini using `Gemini:ApiKey` from configuration before returning parsed recipe data to prefill the form.
- Prefer relative `/api`, `/hubs`, and `/images` URLs in the client so Vite proxying keeps local development consistent. Reuse `MyClient/src/helpers/getImageUrl.ts` for image paths when possible instead of introducing new hardcoded backend origins.
