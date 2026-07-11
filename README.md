# 🔄 SoloSync

> **The Ultimate Freelancer Workspace & Automated Communication Hub**

SoloSync is an elegant, full-featured workspace dashboard designed specifically for freelancers to centralize project management, payment tracking, invoices, and scheduling, while automating repetitive client communications. Built with a fast **React (Vite) frontend** and a lightweight, dependency-free **Go backend**, SoloSync streamlines your workflow and keeps your clients updated automatically.

---

## 🚀 Key Features

### 💻 Frontend Workspace (React)
- **Unified Dashboard**: View active projects, client lists, upcoming meetings, and financial summaries in one place.
- **Client & Project Tracker**: Create and track current and closed projects with detailed progress visualization.
- **Financial Tracker & Invoicing**: Monitor project budgets, track advance deposits, record final payments, and view invoice history.
- **Dynamic Theming**: Support for smooth light and dark modes, fully persisted via `localStorage`.
- **Integrated Scheduling**:
  - **Meet Schedule**: Book, manage, and track upcoming client meetings.
  - **Deadline Schedule**: A visual calendar mapping project due dates.
- **Google Calendar Sync**: Native Google Calendar integration using Google Identity Services (GIS) OAuth 2.0. Sync your freelance meetings to your calendar automatically.
- **Reminders Panel**: A dedicated interface to review scheduled reminders and run immediate manual trigger tests.

### ⚙️ Backend Services (Go)
- **Dependency-Free HTTP API**: High-performance backend routing built using native `net/http` ServeMux.
- **Modular SMTP Email Service**: Decoupled behind a clean `Service` interface to support easy transport swapping or offline mock testing.
- **Dynamic HTML Email Templates**: Sends responsive, visually appealing client emails styled for light/dark viewports.
- **Automated Reminder Scheduler**: An in-memory, thread-safe daily runner that checks deadlines and fires alerts at critical milestones.

---

## 📧 Automated Notification Workflows

SoloSync acts as your automated virtual assistant, triggering emails on specific project events:

1. **Client Welcome Kickoff** (Blue Theme)
   - *Trigger*: Creating a new project with a client email address in the dashboard modal.
   - *Behavior*: Automatically emails the client a professional kickoff message containing project details, estimate budgets, and timelines.
2. **Project Completion Thank You** (Green Theme)
   - *Trigger*: Marking an active project as completed in the dashboard.
   - *Behavior*: Emails the client a thank-you message, logs the completion date, and begins final invoice processing.
3. **Smart Deadline Reminders** (Yellow/Orange/Red Theme)
   - *Trigger*: Daily background check by the Go scheduler or manual trigger from the UI.
   - *Behavior*: Scans all active projects. Dispatches alert emails to the freelancer when projects are exactly **5 days**, **3 days**, or **1 day** away from their due date. Uses deduplication to ensure each reminder is only sent once.

---

## 📂 Project Structure

Below is the file structure of SoloSync, with links to key components:

- **Root files**:
  - [Root README.md](file:///Users/rucha/Downloads/SoloSync/README.md)
  - [Root gitignore](file:///Users/rucha/Downloads/SoloSync/.gitignore)
- **Frontend App**: [frontend/](file:///Users/rucha/Downloads/SoloSync/frontend)
  - [Entry point (main.jsx)](file:///Users/rucha/Downloads/SoloSync/frontend/src/main.jsx)
  - [Main App Layout (App.jsx)](file:///Users/rucha/Downloads/SoloSync/frontend/src/App.jsx)
  - [Theme State & Persistence (ThemeContext.jsx)](file:///Users/rucha/Downloads/SoloSync/frontend/src/context/ThemeContext.jsx)
  - [Auth Context Simulation (AuthContext.jsx)](file:///Users/rucha/Downloads/SoloSync/frontend/src/context/AuthContext.jsx)
  - Services:
    - [Reminder Service Integrations (ReminderService.js)](file:///Users/rucha/Downloads/SoloSync/frontend/src/services/ReminderService.js)
    - [Google Calendar GIS Client (googleCalendarService.js)](file:///Users/rucha/Downloads/SoloSync/frontend/src/services/googleCalendarService.js)
    - [Payment Local Storage (paymentService.js)](file:///Users/rucha/Downloads/SoloSync/frontend/src/services/paymentService.js)
    - [Project Operations & Events (scheduleService.js)](file:///Users/rucha/Downloads/SoloSync/frontend/src/services/scheduleService.js)
  - Pages:
    - [Active Projects Grid (CurrentProjects.jsx)](file:///Users/rucha/Downloads/SoloSync/frontend/src/pages/CurrentProjects.jsx)
    - [Closed Project History (ClosedProjects.jsx)](file:///Users/rucha/Downloads/SoloSync/frontend/src/pages/ClosedProjects.jsx)
    - [Meeting Booking (MeetSchedule.jsx)](file:///Users/rucha/Downloads/SoloSync/frontend/src/pages/MeetSchedule.jsx)
    - [Project Deadline Calendar (DeadlineSchedule.jsx)](file:///Users/rucha/Downloads/SoloSync/frontend/src/pages/DeadlineSchedule.jsx)
    - [Financial & Payment Dashboard (Payments.jsx)](file:///Users/rucha/Downloads/SoloSync/frontend/src/pages/Payments.jsx)
    - [Reminder Config & Manual Testing (Reminders.jsx)](file:///Users/rucha/Downloads/SoloSync/frontend/src/pages/Reminders.jsx)
- **Backend Services**: [backend/](file:///Users/rucha/Downloads/SoloSync/backend)
  - [Main Application Entry (main.go)](file:///Users/rucha/Downloads/SoloSync/backend/cmd/server/main.go)
  - [Application Configuration (config/)](file:///Users/rucha/Downloads/SoloSync/backend/internal/config)
  - [Email Interface & Config (email/service.go)](file:///Users/rucha/Downloads/SoloSync/backend/internal/email/service.go)
  - [SMTP Client Implementation (email/smtp.go)](file:///Users/rucha/Downloads/SoloSync/backend/internal/email/smtp.go)
  - [Reminder Verification Logic (reminder/service.go)](file:///Users/rucha/Downloads/SoloSync/backend/internal/reminder/service.go)
  - [Background Thread Scheduler (reminder/scheduler.go)](file:///Users/rucha/Downloads/SoloSync/backend/internal/reminder/scheduler.go)
  - [Endpoint Handler Mapping (router/router.go)](file:///Users/rucha/Downloads/SoloSync/backend/internal/router/router.go)
  - HTTP Request Handlers:
    - [Email Handler (email_handler.go)](file:///Users/rucha/Downloads/SoloSync/backend/internal/handlers/email_handler.go)
    - [Reminder Handler (reminder_handler.go)](file:///Users/rucha/Downloads/SoloSync/backend/internal/handlers/reminder_handler.go)

---

## ⚙️ Configuration

Both parts of the application require configuring simple environment variables to run.

### 1. Backend Configuration
Navigate to the `backend/` directory, create a `.env` file from the template, and populate it with your real SMTP server credentials:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file:
```ini
SERVER_PORT=8080
SMTP_HOST=smtp.gmail.com          # SMTP provider host (e.g. smtp.gmail.com)
SMTP_PORT=587                     # Secure port (usually 587 for TLS)
SMTP_USERNAME=your-email@gmail.com # Your email address
SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx # App password (NOT your login password)
SMTP_FROM=your-email@gmail.com    # Sender address
```

### 2. Frontend Configuration
Navigate to the `frontend/` directory, create a `.env` file, and set up your Google OAuth credentials if you want to use the Google Calendar Sync feature:

```bash
cd frontend
cp .env.example .env
```

Edit the `.env` file:
```ini
# Google Calendar Integration
# Get your Client ID from https://console.cloud.google.com
# 1. Enable Google Calendar API
# 2. Create OAuth 2.0 Web Client ID
# 3. Add http://localhost:5173 to Authorized JavaScript origins
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id-here
```

---

## 🏃 Getting Started & Running Locally

### Start the Backend (Go)
Open a terminal window and run:
```bash
cd backend
# Load environment variables into shell
export $(grep -v '^#' .env | xargs)
# Start the server
go run ./cmd/server
```
The server will run on `http://localhost:8080`.

### Start the Frontend (Vite)
Open a separate terminal window and run:
```bash
cd frontend
npm install
npm run dev
```
The frontend will start and be accessible at `http://localhost:5173`.

---

## 🔌 API Documentation

| HTTP Method | Endpoint | Request Body (JSON) | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | None | Basic service check. Returns `{"status":"ok"}`. |
| **POST** | `/api/email/send` | `{"to": [...], "subject": "", "body": "", "isHtml": bool}` | Sends a generic plain-text or custom HTML email. |
| **POST** | `/api/email/welcome-client` | `{"clientEmail": "", "clientName": "", "projectName": "", "freelancerName": "", "freelancerEmail": "", "dueDate": "", "budget": 0.0}` | Emails client details & welcomes them to the project kickoff. |
| **POST** | `/api/email/thank-you-client` | `{"clientEmail": "", "clientName": "", "projectName": "", "freelancerName": ""}` | Sends completion email to client. |
| **POST** | `/api/reminders/register` | `{"freelancerEmail": "", "projects": [{"name": "", "client": "", "dueDate": "YYYY-MM-DD"}]}` | Registers/updates in-memory freelancer project list for daily runs. |
| **POST** | `/api/reminders/trigger-now` | Same as `/register` | Triggers reminder evaluation immediately for tests. |

---

## 🧪 Testing the Automated Emails
To verify SMTP integration:
1. Make sure your Go backend is configured with a valid email server in `backend/.env`.
2. Run both the frontend and backend.
3. Open `http://localhost:5173` and log in or create an account.
4. Go to **Reminders** in the sidebar.
5. Click **Trigger Now**. If your project has a due date 1, 3, or 5 days in the future, you will receive a beautifully formatted email alert at your freelancer email address.
