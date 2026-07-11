# SoloSync Backend

Go backend for SoloSync automation, email reminders, and Google Calendar event creation.

## Configuration

All credentials are read from environment variables. Do not hardcode secrets.

Copy `.env.example` to `.env` and fill in real values:

```bash
SERVER_PORT=8080
FRONTEND_URL=http://localhost:5173
DATABASE_PATH=solosync.db

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@example.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@example.com

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URL=http://localhost:8080/auth/google/callback
```

Create a Google Cloud OAuth client and add `GOOGLE_REDIRECT_URL` as an authorized redirect URI.

## Running

```bash
cd backend
go mod download
go run ./cmd/server
```

The server starts on `SERVER_PORT` and stores Google OAuth tokens in the SQLite database at `DATABASE_PATH`.

## Endpoints

### `GET /auth/google?userEmail=user@example.com`

Starts Google OAuth for the signed-in SoloSync user.

### `GET /auth/google/callback`

Google OAuth callback. Stores `access_token`, `refresh_token`, and `expiry`, then redirects to the Profile page.

### `GET /calendar/status?userEmail=user@example.com`

Returns connection status:

```json
{ "connected": true }
```

### `POST /calendar/create-event`

Creates a Google Calendar event with a popup reminder. Expired tokens are refreshed automatically and persisted.

Request body:

```json
{
  "userEmail": "user@example.com",
  "summary": "Client kickoff",
  "description": "SoloSync meeting for Client kickoff",
  "start": "2026-07-07T10:30:00Z",
  "end": "2026-07-07T11:30:00Z",
  "timeZone": "Asia/Calcutta",
  "reminderMinutes": 10
}
```

### Existing Routes

- `GET /api/health`
- `POST /api/email/send`
- `POST /api/reminders/register`
- `POST /api/reminders/trigger-now`
