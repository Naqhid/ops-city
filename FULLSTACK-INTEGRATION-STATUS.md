# CityOps full-stack package status

This package combines the current React + TypeScript frontend and Node.js + Express + MySQL backend scaffold.

## Database safety
- The existing local database is expected to have already been created from the user's SQL Server-to-MySQL conversion.
- Do not re-import `Avion.sql` or overwrite existing records.
- No speculative schema-changing migration is included. `backend/database/migrations/README.md` explains how to add verified migrations.
- `backend/database/migrate.js` runs only numbered `.sql` migration files that are explicitly placed in the migrations directory. It does not run on server startup.

## Important integration status
The backend includes health, authentication, dashboard-summary, and generic CRUD route scaffolding. The frontend has a reusable API client, but several existing pages still use static sample data or local-only form state. Therefore, this archive is a combined development package, **not yet a verified fully database-driven release**. Each page must be mapped to the real MySQL schema and connected to the corresponding API before production use.

## Run locally
1. Configure `backend/.env` using `backend/.env.example`, including the exact existing database name and credentials.
2. In `backend/`, run `npm install` and `npm run dev`.
3. Check `http://localhost:4000/api/health`.
4. In the project root, set `VITE_API_URL=http://localhost:4000/api` in `.env`.
5. Run `npm install` and `npm run dev` in the root.

Never commit `.env` credentials. Back up MySQL before applying any future migration.
