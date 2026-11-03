# CityOps — Part 2: Backend + Database

This archive is intended to be used alongside **CityOps-Part-1-Frontend.zip**.

## Contents
- `backend/` — Node.js + Express API scaffold, route files, MySQL connection setup, authentication routes/middleware, dashboard route, `.env.example`, and admin setup script.
- `database/avion_mysql.sql` — converted MySQL 8 schema.
- `database/source/Avion-original-SQLServer.sql` — original SQL Server dump retained for comparison/reference.

## Setup
1. Install MySQL 8 and create/import the database by running `database/avion_mysql.sql` in MySQL Workbench or with the MySQL CLI.
2. Copy `backend/.env.example` to `backend/.env` and update the MySQL host, port, database, username, password, JWT secret, and other values.
3. Open a terminal in `backend/` and run `npm install`.
4. Start the API with `npm run dev` (or the script listed in `backend/package.json`).
5. Configure the frontend API base URL to point to the backend, typically `http://localhost:4000/api`.

## Important migration notes
- The original SQL Server file is included as a reference. The converted MySQL file is a schema conversion, not a data export: the original dump contains no `INSERT INTO` statements, so it does not include the original database records.
- SQL Server stored procedures/functions, triggers, constraints, indexes, and vendor-specific behavior may require additional migration and validation before production use.
- This is the backend scaffold supplied with the project; verify and connect every frontend screen to its matching API and test authentication/authorization and CRUD operations before treating the application as complete.
