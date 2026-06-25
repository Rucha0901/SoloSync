# FreelanceFlow Backend

A minimal, dependency-free Go backend exposing a modular SMTP email service.

## Project Structure

```
backend/
├── cmd/
│   └── server/
│       └── main.go          # Application entrypoint
├── internal/
│   ├── config/               # Environment-based configuration
│   ├── email/                # Email Service interface + SMTP implementation
│   ├── handlers/              # HTTP handlers
│   └── router/                # Route definitions
├── .env.example
└── go.mod
```

## Configuration

All SMTP credentials are read from environment variables. None are hardcoded.

Copy `.env.example` to `.env` and fill in real values:

```
SERVER_PORT=8080
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@example.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@example.com
```

Then load it into your shell before running the server:

```bash
export $(grep -v '^#' .env | xargs)
```

## Running

```bash
cd backend
go run ./cmd/server
```

The server starts on `SERVER_PORT` (default `8080`) and fails fast with a clear
error if any required SMTP variable is missing.

## Endpoints

### `GET /api/health`
Returns `{"status":"ok"}`. Useful for verifying the server is up.

### `POST /api/email/send`
Sends an email via SMTP.

Request body:
```json
{
  "to": ["recipient@example.com"],
  "subject": "Hello",
  "body": "Plain text or HTML content",
  "isHtml": false
}
```

Response body:
```json
{
  "success": true,
  "message": "email sent successfully"
}
```

## Design Notes

The email functionality is split into:
- `internal/email/service.go` — the `Service` interface and `Message` type
- `internal/email/smtp.go` — the SMTP implementation of `Service`

This separation means the email service can be reused by future automation
features, or have its transport swapped, without changing any calling code.
