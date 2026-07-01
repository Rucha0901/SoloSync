import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo/Logo";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatars/Avatars";
import { PROJECTS_UPDATED_EVENT, getProjects } from "../services/scheduleService";
import "./Home.css";

export default function Home({ onNewProjectClick }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState(() => getProjects());

  useEffect(() => {
    const refreshProjects = () => setProjects(getProjects());

    window.addEventListener(PROJECTS_UPDATED_EVENT, refreshProjects);
    return () => window.removeEventListener(PROJECTS_UPDATED_EVENT, refreshProjects);
  }, []);

  const stats = [
    { label: "Active Projects", value: String(projects.length), change: "+1 this week", path: "/current-projects", type: "success" },
    { label: "Pending Invoices", value: "2", change: "$2,400 outstanding", path: "/invoices", type: "warning" },
    { label: "Payments (MTD)", value: "$6,850", change: "+18% vs last month", path: "/payments", type: "info" },
    { label: "Closed Projects", value: "14", change: "Completed this year", path: "/closed-projects", type: "neutral" },
  ];

  const activities = [
    { id: 1, type: "project", message: "Created project 'Acme Website Redesign'", time: "2 hours ago" },
    { id: 2, type: "invoice", message: "Sent Invoice #INV-004 to Stark Industries", time: "1 day ago" },
    { id: 3, type: "payment", message: "Received payment of $3,500 from Wayne Enterprises", time: "3 days ago" },
  ];

  return (
    <div className="home-dashboard">
      <header className="home-dashboard__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Logo size={40} />
          <h1 className="home-dashboard__title" style={{ marginBottom: 0 }}>Welcome to SoloSync</h1>
        </div>
        <p className="home-dashboard__subtitle">
          Your personal command center. Track your work, invoices, and payments in one unified workspace.
        </p>
        <div className="home-dashboard__welcome">
          {user && (
            <Link to="/profile" className="home-dashboard__avatar-link" aria-label="View profile settings">
              <Avatar id={user.avatarId} size={56} className="home-dashboard__welcome-avatar" />
            </Link>
          )}
          <div>
            <h1 className="home-dashboard__title">Welcome, {user ? user.username : "Freelancer"}</h1>
            <p className="home-dashboard__subtitle">
              Your personal command center. Track your work, invoices, and payments in one unified workspace.
            </p>
          </div>
        </div>
      </header>

      <div className="home-dashboard__stats">
        {stats.map((stat, i) => (
          <Link to={stat.path} key={i} className="home-dashboard__card">
            <span className="home-dashboard__card-label">{stat.label}</span>
            <div className="home-dashboard__card-value-container">
              <span className={`home-dashboard__card-value home-dashboard__card-value--${stat.type}`}>
                {stat.value}
              </span>
            </div>
            <span className="home-dashboard__card-change">{stat.change}</span>
          </Link>
        ))}
      </div>

      <div className="home-dashboard__content">
        <div className="home-dashboard__section">
          <h2 className="home-dashboard__section-title">Recent Activity</h2>
          <div className="home-dashboard__activity-list">
            {activities.map((act) => (
              <div key={act.id} className="home-dashboard__activity-item">
                <div className={`home-dashboard__activity-icon home-dashboard__activity-icon--${act.type}`}>
                  {act.type === "project" && "📁"}
                  {act.type === "invoice" && "📄"}
                  {act.type === "payment" && "💰"}
                </div>
                <div className="home-dashboard__activity-details">
                  <p className="home-dashboard__activity-message">{act.message}</p>
                  <span className="home-dashboard__activity-time">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="home-dashboard__section home-dashboard__section--shortcuts">
          <h2 className="home-dashboard__section-title">Quick Actions</h2>
          <div className="home-dashboard__shortcuts-grid">
            <button
              onClick={onNewProjectClick}
              className="home-dashboard__shortcut-btn home-dashboard__shortcut-btn--primary"
            >
              <span className="home-dashboard__shortcut-icon">+</span>
              Create New Project
            </button>
            <Link to="/invoices" className="home-dashboard__shortcut-btn">
              Create Invoice
            </Link>
            <Link to="/payments" className="home-dashboard__shortcut-btn">
              View Payments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
