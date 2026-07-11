# SoloSync Frontend

React dashboard shell built with Vite.

## Running

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`.

## Configuration

```bash
VITE_API_BASE_URL=http://localhost:8080
```

The Profile page uses this backend URL to show Google Calendar connection status and start OAuth. The Add Meet modal can create a Google Calendar event after a meeting is saved locally when the user enables the checkbox.

## Build

```bash
npm run build
npm run preview
```
