import { useEffect, useMemo, useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatars/Avatars";
import { PROJECTS_UPDATED_EVENT, getProjects } from "../services/scheduleService";
import { getPaymentProjects, calculatePaymentSummary, PAYMENT_UPDATED_EVENT } from "../services/paymentService";
import "./Home.css";

export default function Home({ onNewProjectClick }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState(() => getProjects());
  const [paymentProjects, setPaymentProjects] = useState(() => getPaymentProjects());

  useEffect(() => {
    const refreshProjects = () => {
      setProjects(getProjects());
      setPaymentProjects(getPaymentProjects());
    };

    window.addEventListener(PROJECTS_UPDATED_EVENT, refreshProjects);
    window.addEventListener(PAYMENT_UPDATED_EVENT, refreshProjects);
    return () => {
      window.removeEventListener(PROJECTS_UPDATED_EVENT, refreshProjects);
      window.removeEventListener(PAYMENT_UPDATED_EVENT, refreshProjects);
    };
  }, []);

  const activeProjectsCount = useMemo(() => {
    return projects.filter(p => p.status !== "Completed" && p.status !== "Closed").length;
  }, [projects]);

  const summary = useMemo(() => calculatePaymentSummary(paymentProjects), [paymentProjects]);

  const stats = [
    {
      label: "Active Projects",
      value: String(activeProjectsCount),
      change: "Currently in progress",
      path: "/dashboard/current-projects",
      type: "success",
    },
    {
      label: "Pending Payments",
      value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(summary.pendingPayments),
      change: "Outstanding revenue",
      path: "/dashboard/payments",
      type: "warning",
    },
    {
      label: "Completed Payments",
      value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(summary.completedPayments),
      change: "Realized revenue",
      path: "/dashboard/payments",
      type: "info",
    },
    {
      label: "Monthly Income",
      value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(summary.currentMonthIncome),
      change: "Received this month",
      path: "/dashboard/payments",
      type: "neutral",
    },
  ];

  const recentActivities = useMemo(() => {
    const activities = [];
    projects.forEach(p => {
      if (p.createdAt) {
        activities.push({
          id: `create-${p.id}`,
          type: "project",
          message: `Started project '${p.name}'`,
          timestamp: new Date(p.createdAt).getTime(),
          timeStr: new Date(p.createdAt).toLocaleDateString(),
        });
      }
      if (p.completedDate) {
        activities.push({
          id: `complete-${p.id}`,
          type: "project",
          message: `Completed project '${p.name}'`,
          timestamp: new Date(p.completedDate).getTime(),
          timeStr: new Date(p.completedDate).toLocaleDateString(),
        });
      }
    });

    paymentProjects.forEach(pp => {
      if (pp.paymentReceived && pp.paymentReceivedAt) {
        activities.push({
          id: `pay-received-${pp.id}`,
          type: "payment",
          message: `Received final payment for '${pp.name}'`,
          timestamp: new Date(pp.paymentReceivedAt).getTime(),
          timeStr: new Date(pp.paymentReceivedAt).toLocaleDateString(),
        });
      }
      if (pp.advancePaid > 0 && pp.advancePaidAt) {
        activities.push({
          id: `pay-advance-${pp.id}`,
          type: "payment",
          message: `Received advance payment of $${pp.advancePaid.toLocaleString()} for '${pp.name}'`,
          timestamp: new Date(pp.advancePaidAt).getTime(),
          timeStr: new Date(pp.advancePaidAt).toLocaleDateString(),
        });
      }
    });

    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }, [projects, paymentProjects]);

  return (
    <div className="home-dashboard">
      <header className="home-dashboard__header">
        <div className="home-dashboard__welcome">
          {user && (
            <Link to="/dashboard/profile" className="home-dashboard__avatar-link" aria-label="View profile settings">
              <Avatar id={user.avatarId} size={56} className="home-dashboard__welcome-avatar" />
            </Link>
          )}
          <div>
            <h1 className="home-dashboard__title" style={{ marginBottom: 4 }}>
              Welcome back, {user ? user.username : "Freelancer"}
            </h1>
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
                    <span className="home-dashboard__activity-time">{act.timeStr}</span>
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
              onClick={onNewProjectClick}
              className="home-dashboard__shortcut-btn home-dashboard__shortcut-btn--primary"
            >
              <span className="home-dashboard__shortcut-icon">+</span>
              Create New Project
            </button>
            <Link to="/dashboard/invoices" className="home-dashboard__shortcut-btn">
              Create Invoice
            </Link>
            <Link to="/dashboard/payments" className="home-dashboard__shortcut-btn">
              Manage Finances
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
