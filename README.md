# FreelanceFlow

An open-source dashboard for freelancers to organize and manage their work.
This is the foundational stage of the project: navigation shell, theming, and
a modular SMTP email service on the backend. No business logic, auth, or
database has been implemented yet by design.

## Structure

```
freelanceflow/
├── frontend/    React dashboard shell (navigation, theming, routing)
└── backend/     Go SMTP email service
```

See `frontend/README.md` and `backend/README.md` for details specific to each.

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env   # fill in real SMTP credentials
export $(grep -v '^#' .env | xargs)
go run ./cmd/server
```

Runs on `http://localhost:8080` by default.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` by default.

## What's Implemented

**Frontend**
- GitHub-style hamburger menu that opens a slide-out sidebar with smooth
  open/close animation, closes on outside click or Escape
- Sidebar links: Current Projects, Closed Projects, Payments, Invoices —
  each routed to its own placeholder page
- Light/dark theme toggle, persisted to `localStorage`, applied across the
  entire UI via CSS variables

**Backend**
- `POST /api/email/send` — sends an email through SMTP
- `GET /api/health` — basic health check
- SMTP credentials are read from environment variables only, never hardcoded
- Email sending logic lives behind a `Service` interface so it can be reused
  by future automation features without changes to calling code

## What's Intentionally Not Implemented Yet

Authentication, a database, payment processing, project management logic,
and automation workflows are out of scope for this stage.
