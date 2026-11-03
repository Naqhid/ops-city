# CityOps Property Management — Full-Stack Development Package

This folder contains the existing React + TypeScript UI and a Node.js + Express + MySQL backend scaffold.

## Important
- Use your already-created local MySQL database. Do **not** re-import `Avion.sql` from this package.
- Configure `backend/.env` with your actual local MySQL database name and credentials.
- No schema-changing SQL migration is included because required schema changes must be verified against your local database first.
- Some frontend pages still contain hardcoded sample data/local-only form operations. This package is not yet a fully integrated production release; see `FULLSTACK-INTEGRATION-STATUS.md`.

## Start the backend
```bash
cd backend
npm install
npm run dev
```
Health check: `http://localhost:4000/api/health`

## Start the frontend
In a separate terminal, from the project root:
```bash
npm install
```
Create root `.env` with:
```env
VITE_API_URL=http://localhost:4000/api
```
Then run:
```bash
npm run dev
```

## Migrations
Review `backend/database/migrations/README.md`. Only reviewed, numbered `.sql` files are run by `npm run migrate`. Back up the database before applying any migration. Migration runner does not run automatically when the server starts.
