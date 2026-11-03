# Agreement templates API integration

The Agreements page now reads, searches, exports, creates, and updates agreement templates through `GET /api/agreements`, `POST /api/agreements`, and `PUT /api/agreements/:id`.

The supplied backend had `agreements: null` and the database schema had no agreement-template table. The ZIP therefore includes `backend-patch/` with:
- an updated `backend/src/resources.js` mapping `agreements` to `AgreementTemplate`;
- a numbered SQL migration creating `AgreementTemplate`.

Apply the patch to the matching backend project, then run the existing migration command from the backend directory after checking your `.env` and taking a database backup:

`npm run migrate`

Restart the API after applying the updated `resources.js`. The migration creates a new table only; it does not alter existing tables or seed fake records. The frontend API base is controlled by `VITE_API_URL` (default `http://localhost:4000/api`).
