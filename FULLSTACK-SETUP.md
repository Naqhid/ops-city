# CityOps full-stack setup (React + Node/Express + MySQL)

## Included
- Existing React + TypeScript frontend (kept intact).
- `backend/`: Express REST API, MySQL connection pool, health check, dashboard summary, login/JWT middleware foundation, safe allowlisted generic CRUD endpoints.
- `database/avion_mysql.sql`: converted SQL Server schema for MySQL 8, plus `app_users` for the API's login. The supplied `Avion.sql` had table definitions but no INSERT data.
- `src/api/client.ts`: reusable frontend API client. Existing screens still need to be switched from demo/local data to API calls page by page; this scaffold does not silently change UI behavior.

## 1. Import MySQL schema
Create a database/user in MySQL if needed, then run:
```bash
mysql -u root -p < database/avion_mysql.sql
```
The script creates and uses `avion_cityops`. Review the converted schema and take a backup before importing into any production database. The conversion retains columns and primary keys, and the Countries.Iso unique key; SQL Server-specific indexes, foreign-key constraints, triggers, stored procedures, and source data are not included.

## 2. Start backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials and a unique JWT_SECRET (32+ random characters)
npm run dev
```
Check `http://localhost:4000/api/health`.

## 3. Create first admin
```bash
cd backend
npm run create-admin -- admin@example.com admin 'Use-A-Strong-Password-Here' 'CityOps Admin'
```
Login: `POST /api/auth/login` JSON `{ "email": "admin@example.com", "password": "..." }`. The response contains a bearer token. `GET /api/auth/me` validates it. The generic CRUD routes are currently public to make local UI integration easy; protect them with `requireAuth` before deployment. Do not expose this API publicly until authorization and field-level validation are completed.

## 4. Frontend
At the project root, create `.env` with `VITE_API_URL=http://localhost:4000/api`, then run `npm install` and `npm run dev`. The included `src/api/client.ts` exposes `api.get/post/put/delete`.

## Resource endpoints
`GET /api` lists resources. For mapped tables: `GET /api/investors`, `POST /api/investors`, `GET/PUT/DELETE /api/investors/:id`; similarly `buildings`, `owners`, `organizations`, `floors`, `units`, `tenants`, `rentals`, `investor-relations`, `building-portfolios`, `costs`, `unit-pricing`. Query supports `q`, `page`, `limit`, `sort`, `order`, and exact column filters. Column names in request bodies are the original SQL Server column names. `GET /api/dashboard/summary` returns count and aggregate metrics.

## Important conversion notes
The source is a legacy SQL Server schema from around 2020 and appears to be schema-only. MySQL DDL conversion is mechanical, not a verified migration of production records. The SQL Server dump contains relationships and application-specific assumptions that need review; constraints were not blindly carried over because the source relationships are inconsistent/legacy. Also, existing frontend screens are mostly local/demo-state UI. Backend endpoints and an API client are included, but true full-stack completion requires wiring each page's forms, filters, list refreshes, and delete/edit actions to those endpoints and validating them against real data.
