# CityOps frontend API integration notes

## Configuration
Set `VITE_API_URL=http://localhost:4000/api` in `.env.local` (or your deployed API base). The shared clients attach the `cityops_token` bearer token.

## Backend resources available in the supplied backend
`investors`, `buildings`, `owners`, `organizations`, `floors`, `units`, `tenants`, `rentals`, `investor-relations`, `building-portfolios`, `costs`, `unit-pricing`, `sources`, `banks`, and `investments`. Dashboard summary is `GET /api/dashboard/summary`; authentication is `POST /api/auth/login` and `GET /api/auth/me`.

## Important integration status
This `src` package is **not yet a fully integrated production frontend**. The login/logout flow and Bank Details page call the backend, and shared CRUD adapters are provided for the backend resources. Several screens in the original UI still use local demo state or hardcoded rows; their UI actions have not all been converted to API-backed CRUD. Do not treat the package as fully integrated until those pages are converted and end-to-end tested.

The supplied backend has no working resource configuration for agreements (`agreements: null`), and the frontend's agreement template save action therefore cannot persist through the current generic resource route. Report pages need aggregation or dedicated report endpoints rather than demo rows. The backend also needs authentication middleware applied to protected resource routes; a frontend login alone does not protect those endpoints.

No database import or database changes are performed by this frontend package.
