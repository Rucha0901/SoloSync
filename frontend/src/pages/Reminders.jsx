import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ALL_PROJECTS } from "../services/ReminderService";
import "./Reminders.css";

const BACKEND_BASE = "http://localhost:8080";

export default function Reminders() {
  const { user } = useAuth();
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  const handleTriggerNow = async () => {
    setStatus("loading");
    setMessage("");

    const payload = {
      freelancerEmail: user.email,
      projects: ALL_PROJECTS.map((p) => ({
        name: p.name,
        client: p.client,
        dueDate: p.dueDate,
      })),
    };

    try {
      const res = await fetch(`${BACKEND_BASE}/api/reminders/trigger-now`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setStatus(data.success ? "success" : "error");
      setMessage(data.message);
    } catch (err) {
      setStatus("error");
      setMessage("Could not reach the backend. Make sure the Go server is running on port 8080.");
    }
  };

  return (
    <div className="reminders-page">
      <header className="reminders-page__header">
        <h1 className="reminders-page__title">Email Reminders</h1>
        <p className="reminders-page__subtitle">
          SoloSync automatically sends you deadline reminders at 5, 3, and 1 day before each project is due — straight to your inbox.
        </p>
      </header>

      {/* How it works */}
      <section className="reminders-card">
        <h2 className="reminders-card__title">How Automation Works</h2>
        <div className="reminders-timeline">
          {[
            { days: 5, label: "5 days before", color: "#f59e0b", desc: "Early heads-up to prepare deliverables." },
            { days: 3, label: "3 days before", color: "#f97316", desc: "Mid-stage check to review your progress." },
            { days: 1, label: "1 day before", color: "#ef4444", desc: "Final urgent reminder — review and submit." },
          ].map((item) => (
            <div key={item.days} className="reminders-timeline__item" style={{ "--reminder-color": item.color }}>
              <div className="reminders-timeline__badge">{item.days}d</div>
              <div className="reminders-timeline__body">
                <strong className="reminders-timeline__label">{item.label}</strong>
                <span className="reminders-timeline__desc">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="reminders-card__note">
          The Go backend scheduler checks all project due dates every <strong>24 hours</strong>. Reminder emails are sent to <strong>{user?.email}</strong>.
        </p>
      </section>

      {/* Projects being monitored */}
      <section className="reminders-card">
        <h2 className="reminders-card__title">Projects Being Monitored</h2>
        <div className="reminders-projects-list">
          {ALL_PROJECTS.map((proj) => {
            const due = new Date(proj.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const daysLeft = Math.round((due - today) / (1000 * 60 * 60 * 24));
            const isClose = daysLeft <= 5 && daysLeft >= 0;
            const isOverdue = daysLeft < 0;

            return (
              <div key={proj.id} className="reminders-project-row">
                <div className="reminders-project-row__info">
                  <span className="reminders-project-row__name">{proj.name}</span>
                  <span className="reminders-project-row__client">{proj.client}</span>
                </div>
                <div className="reminders-project-row__due">
                  <span className="reminders-project-row__date">
                    {due.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span
                    className={`reminders-project-row__badge ${
                      isOverdue
                        ? "reminders-project-row__badge--overdue"
                        : isClose
                        ? "reminders-project-row__badge--close"
                        : "reminders-project-row__badge--ok"
                    }`}
                  >
                    {isOverdue
                      ? "Overdue"
                      : isClose
                      ? `${daysLeft}d left`
                      : `${daysLeft}d left`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Manual trigger */}
      <section className="reminders-card reminders-card--trigger">
        <div className="reminders-trigger-body">
          <div>
            <h2 className="reminders-card__title" style={{ marginBottom: 4 }}>Test Reminders Now</h2>
            <p className="reminders-card__note" style={{ margin: 0 }}>
              Instantly trigger a reminder check and send emails for any projects that are due in 1, 3, or 5 days.
            </p>
          </div>
          <button
            type="button"
            className={`reminders-trigger-btn ${status === "loading" ? "reminders-trigger-btn--loading" : ""}`}
            onClick={handleTriggerNow}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <>
                <span className="reminders-trigger-btn__spinner" />
                Sending...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Send Test Reminders
              </>
            )}
          </button>
        </div>

        {status === "success" && (
          <div className="reminders-banner reminders-banner--success">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>{message}</span>
          </div>
        )}

        {status === "error" && (
          <div className="reminders-banner reminders-banner--error">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>{message}</span>
          </div>
        )}
      </section>
    </div>
  );
}
