# CityOps frontend API integration status

This package preserves the existing UI and adds a typed, reusable HTTP client at `src/lib/api.ts`. Configure `VITE_API_URL` in `.env.local`.

**Important:** adding a client does not automatically convert every page from local demo data to database data. The current pages still require page-specific wiring to API endpoints and database field mapping. Do not treat this package as a completed end-to-end integration until those pages are connected and tested against the local database.

The backend's generic resource routes return `{ data, pagination }` for list calls and `{ data }` for single-record/create/update calls. Verify each route/table mapping in the backend README before use.
