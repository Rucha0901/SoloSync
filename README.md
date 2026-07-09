# SoloSync

A freelancer management dashboard that centralizes projects, payments, invoices, reminders, and meeting schedules in one place.

## Structure

```text
SoloSync/
├── frontend/    React dashboard shell
└── backend/     Go backend for email reminders and Google Calendar
```

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env
go mod download
go run ./cmd/server
```

Required Google OAuth variables:

```bash
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URL=http://localhost:8080/auth/google/callback
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Google Calendar

- Connect from `Dashboard -> Profile -> Google Calendar`.
- Add a meeting from the navbar and enable `Add to Google Calendar`.
- The backend stores Google `access_token`, `refresh_token`, and token expiry in SQLite.
- Expired Google tokens are refreshed automatically before event creation.
- Created events include a popup reminder.
