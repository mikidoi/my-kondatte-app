# Copilot Instructions

## Overview

Kondatte (献立) is a meal planning web app. It consists of two projects:

- **`MyApi/`** — ASP.NET Core Web API, SQLite via EF Core, AutoMapper, Swagger
- **`MyClient/`** — React 19 + TypeScript SPA, Vite, MUI v9, TanStack Query, React Router v7, openapi-fetch

## Commands

### Backend (`MyApi/`)
```bash
dotnet run --project MyApi        # Runs on http://localhost:5109
```
Swagger UI is available at `http://localhost:5109/swagger` in development.

### Frontend (`MyClient/`)
```bash
cd MyClient
npm run dev        # Dev server on http://localhost:5173
npm run build      # tsc + vite build
npm run lint       # ESLint
```

### Regenerate API types (requires API running)
```bash
cd MyClient && npm run gen:api
# Fetches http://localhost:5109/swagger/v1/swagger.json → src/shared/api/schema.d.ts
```

## Architecture

### API type safety flow
The frontend uses `openapi-fetch` with a fully typed client. The flow is:

1. API defines endpoints with `[ProducesResponseType<T>]` attributes
2. Swagger generates an OpenAPI spec at runtime
3. `npm run gen:api` regenerates `MyClient/src/shared/api/schema.d.ts`
4. The typed `api` client in `src/shared/api/client.ts` uses those types
5. TanStack Query hooks in `src/shared/api/` wrap the client calls

**After adding or changing any API endpoint, regenerate `schema.d.ts`.**

### Domain model
- `Recipe` — name, description, ingredients, instructions, optional sourceUrl
- `WeeklyMealPlan` — identified by `WeekStartDate` (always normalized to Sunday); one-to-many `PlannedMeals`
- `PlannedMeal` — belongs to a `WeeklyMealPlan`, references a `Recipe`, unique per `(WeeklyMealPlanId, DayOfWeek)`

## Key Conventions

### Frontend API hooks
New data-fetching hooks go in `src/shared/api/` following the `useRecipes.ts` pattern:
```ts
export function useMyThing() {
  return useQuery({
    queryKey: myThingKeys.all,
    queryFn: async () => {
      const { data, error } = await api.GET("/api/my-thing");
      if (error) throw error;
      return data;
    },
  });
}
```

### Backend DTOs and mapping
- Read DTOs: `*Dto.cs` (returned to client)
- Write DTOs: `Save*Dto.cs` / `*UpdateDto.cs` (received from client)
- AutoMapper profiles in `MyApi/Mappings/` — one profile per model
- `Id` is always ignored in update mappings (see `RecipeProfile.cs`)

### WeekStartDate normalization
Any date input for `WeekStartDate` is normalized to the preceding Sunday via `WeekHelper.StartOfWeek()` in both POST and PUT handlers.

### CORS
The API allows requests only from `http://localhost:5173`. If the frontend port changes, update `Program.cs`.

### Environment
Frontend reads `VITE_API_URL` from `MyClient/.env` (default: `http://localhost:5109`).
