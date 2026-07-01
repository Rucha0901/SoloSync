import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo/Logo";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../context/ProjectContext";
import Avatar from "../components/Avatars/Avatars";
import NewProjectModal from "../components/Modals/NewProjectModal";
import "./Home.css";

export default function Home() {
  const { user } = useAuth();
  const { projects } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeProjectsCount = projects.length;
  const pendingPayments = projects.reduce((total, p) => total + (p.budget - p.totalPaid), 0);
  const totalReceived = projects.reduce((total, p) => total + p.totalPaid, 0);

  const stats = [
    { label: "Active Projects", value: activeProjectsCount.toString(), change: "+1 this week", path: "/current-projects", type: "success" },
    { label: "Pipeline Value", value: `$${pendingPayments.toLocaleString()}`, change: "Target revenue", path: "/payments", type: "warning" },
    { label: "Payments (Total)", value: `$${totalReceived.toLocaleString()}`, change: "Realized revenue", path: "/payments", type: "info" },
    { label: "Payment Status", value: "Healthy", change: "Across all clients", path: "/payments", type: "neutral" },
  ];

  const recentActivities = projects
    .flatMap(p => [
      { id: `create-${p.id}`, type: "project", message: `Started project '${p.name}'`, date: p.id.split('-')[1] },
      ...p.payments.map(pay => ({ id: pay.id, type: "payment", message: `Received ${pay.type} for '${p.name}'`, date: pay.id.split('-')[1] }))
    ])
    .sort((a, b) => b.date - a.date)
    .slice(0, 5);

  return (
    <div className="home-dashboard">
      <header className="home-dashboard__header">
        <div className="home-dashboard__welcome">
          {user && (
            <Link to="/profile" className="home-dashboard__avatar-link" aria-label="View profile settings">
              <Avatar id={user.avatarId} size={56} className="home-dashboard__welcome-avatar" />
            </Link>
          )}
          <div>
            <h1 className="home-dashboard__title" style={{ marginBottom: 4 }}>Welcome back, {user ? user.username : "Freelancer"}</h1>
            <p className="home-dashboard__subtitle">
              Your command center is ready. You have {activeProjectsCount} active projects.
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
          <h2 className="home-dashboard__section-title">Global Activity</h2>
          <div className="home-dashboard__activity-list">
            {recentActivities.length > 0 ? (
              recentActivities.map((act) => (
                <div key={act.id} className="home-dashboard__activity-item">
                  <div className={`home-dashboard__activity-icon home-dashboard__activity-icon--${act.type}`}>
                    {act.type === "project" && "📁"}
                    {act.type === "payment" && "💰"}
                  </div>
                  <div className="home-dashboard__activity-details">
                    <p className="home-dashboard__activity-message">{act.message}</p>
                    <span className="home-dashboard__activity-time">Automated log</span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No recent activity to show.</p>
            )}
          </div>
        </div>

        <div className="home-dashboard__section home-dashboard__section--shortcuts">
          <h2 className="home-dashboard__section-title">Quick Actions</h2>
          <div className="home-dashboard__shortcuts-grid">
            <button
              onClick={() => setIsModalOpen(true)}
              className="home-dashboard__shortcut-btn home-dashboard__shortcut-btn--primary"
            >
              <span className="home-dashboard__shortcut-icon">+</span>
              Create New Project
            </button>
            <Link to="/invoices" className="home-dashboard__shortcut-btn">
              Create Invoice
            </Link>
            <Link to="/payments" className="home-dashboard__shortcut-btn">
              Manage Finances
            </Link>
          </div>
        </div>
      </div>

      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
