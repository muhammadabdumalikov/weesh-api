# Weesh API

Wishlist backend for the Weesh app. Extracted from podarki-uz-backend; provides wishlist and wishlist-auth only.

## Setup

1. Copy `.env.example` to `.env` and set:
   - Database: `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` (or `PGSTRING_INTERNAL`)
   - `GOOGLE_CLIENT_ID` (same as frontend `NEXT_PUBLIC_GOOGLE_CLIENT_ID`) for Google sign-in
   - Optional: `TELEGRAM_BOT_TOKEN` for Telegram auth; `WEESH_GOOGLE_CLIENT_ID` if different from `GOOGLE_CLIENT_ID`

2. Run migrations:
   ```bash
   npm run migrate:latest
   ```

3. Start:
   ```bash
   npm run start:dev
   ```

API base: `http://localhost:3001/api` (or `HTTP_PORT`). Swagger: `http://localhost:3001/swagger`.

## Endpoints

- **wishlist-auth**: `POST /api/wishlist-auth/sign-up`, `sign-in`, `telegram/sign-up`, `telegram/sign-in`, `google`
- **wishlist**: `POST /api/wishlist/create`, `list`, `get-by-id`, `update`, `delete`

Frontend (weesh) should point `API_BASE_URL` to this API when using it as the backend.
