# Kondate

Kondate is a recipe collection and weekly meal planner. Save your recipes, then plan a week of dinners by picking one recipe per day.

It is also a learning project: I'm using it to practice SQL Server, Microsoft Azure, and GitHub with GitHub Actions.

## Features

- Create, view, edit and delete recipes (name, description, ingredients, instructions, optional source URL)
- Weekly meal plans that start on Sunday
- One planned recipe per day of the week
- REST API with a React frontend

## Tech stack

| Part | Technology |
| --- | --- |
| Frontend | React, TypeScript, MUI, TanStack Query |
| Backend | ASP.NET Core, Entity Framework Core, AutoMapper |
| Database | SQL Server 2022 (Docker locally, Azure SQL planned) |
| CI/CD | GitHub Actions (planned) |
| Hosting | Microsoft Azure (planned) |

## Project structure

```
Kondate/
├── MyApi/          ASP.NET Core API, EF Core DbContext and migrations
└── MyClient/     React app
```

Adjust the folder names above to match the repo.

## Running locally

### Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) (the version the project targets)
- [Node.js](https://nodejs.org/) (LTS)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- The EF Core CLI: `dotnet tool install --global dotnet-ef`

### 1. Start SQL Server in Docker

```bash
docker run -d --name kondate-sql \
  --platform linux/amd64 \
  -e "ACCEPT_EULA=Y" \
  -e "MSSQL_SA_PASSWORD=<your-strong-password>" \
  -p 1433:1433 \
  -v kondate-sql:/var/opt/mssql \
  mcr.microsoft.com/mssql/server:2022-latest
```

The `--platform` flag is needed on Apple Silicon Macs, where the image runs under Rosetta. After the first run, use `docker start kondate-sql` and `docker stop kondate-sql`.

### 2. Configure the connection string

The connection string is stored with .NET user-secrets, so no password is committed to the repo. Run this from the API project folder:

```bash
cd MyApi
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost,1433;Database=Kondate;User Id=sa;Password=<your-strong-password>;TrustServerCertificate=True"
```

### 3. Create the database

```bash
dotnet ef database update
```

This applies the migrations in `MyApi/Migrations` and creates the `Kondate` database.

### 4. Start the API

```bash
dotnet run
```

The API listens on `http://127.0.0.1:5109` by default.

### 5. Start the frontend

```bash
cd <frontend>
npm install
npm run dev
```

Use `npm start` if the project is not set up with Vite.

## Database migrations

Add a migration after changing an entity:

```bash
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

Migration files are committed to the repo.

## Roadmap

- [x] Recipe CRUD
- [x] Weekly meal plans and planned meals
- [x] Recipes and meal plan pages in the frontend
- [x] SQL Server instead of SQLite
- [ ] CI with GitHub Actions (build and test)
- [ ] Deploy to Azure (App Service, Static Web Apps, Azure SQL)
- [ ] CD with GitHub Actions
- [ ] Generate recipe details from a source URL