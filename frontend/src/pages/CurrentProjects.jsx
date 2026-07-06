import { useEffect, useMemo, useState } from "react";
import { PROJECTS_UPDATED_EVENT, getProjects } from "../services/scheduleService";
import ProjectDetailsModal from "../components/ProjectDetailsModal/ProjectDetailsModal";
import { useEffect, useState } from "react";
import { PROJECTS_UPDATED_EVENT, getProjects } from "../services/scheduleService";
import React from "react";
import { useProjects } from "../context/ProjectContext";
import "./Projects.css";

export default function CurrentProjects({ searchQuery = "" }) {
  const { projects } = useProjects();

import { ACTIVE_PROJECTS } from "../services/scheduleService";
import "./Projects.css";

function isClosedProject(project) {
  const status = `${project.status || ""} ${project.statusType || ""}`.toLowerCase();
  return status.includes("closed") || status.includes("completed") || project.progress === 100;
}

function formatDate(value) {
  if (!value) {
    return "Not set";
  }

  return new Date(`${value}T00:00`).toLocaleDateString([], {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(value, fallback) {
  if (Number.isFinite(Number(value))) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(value));
  }

  return fallback || "$0";
}

function formatAdvance(advance) {
  if (!advance?.requested) {
    return "No advance requested";
  }

  const amount = formatCurrency(advance.amount);
  const detail =
    advance.type === "percentage"
      ? `${advance.value}%`
      : formatCurrency(advance.value);

  return `${amount} (${detail})`;
}

export default function CurrentProjects({ searchQuery = "" }) {
  const [projects, setProjects] = useState(() => getProjects());
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return projects.find((p) => p.id === selectedProjectId);
  }, [projects, selectedProjectId]);

  useEffect(() => {
    const refreshProjects = () => setProjects(getProjects());

    window.addEventListener(PROJECTS_UPDATED_EVENT, refreshProjects);
    return () => window.removeEventListener(PROJECTS_UPDATED_EVENT, refreshProjects);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = setTimeout(() => setToastMessage(""), 3500);
    return () => clearTimeout(timeout);
  }, [toastMessage]);

  const handleActionSuccess = (message) => {
    setToastMessage(message);
    setSelectedProjectId(null);
  };

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredProjects = projects.filter((proj) => {
    const searchable = `${proj.name || ""} ${proj.client || ""} ${proj.clientEmail || ""}`.toLowerCase();
    return !isClosedProject(proj) && searchable.includes(normalizedSearch);
  });
  // Filter projects by name or client (case-insensitive)
  const filteredProjects = projects.filter(
    (proj) =>
      proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="projects-page">
      <header className="projects-page__header">
        <h1 className="projects-page__title">Current Projects</h1>
        <p className="projects-page__subtitle">
          Manage your active client contracts and project milestones
        </p>
      </header>

      {filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map((proj) => (
            <article
              key={proj.id}
              className="project-card"
              onClick={() => setSelectedProjectId(proj.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="project-card__header">
                <div className="project-card__title-container">
                  <h2 className="project-card__title" title={proj.name}>
                    {proj.name}
                  </h2>
                  <span className="project-card__client" title={proj.client}>
                    {proj.client}
                  </span>
                </div>
                <span className="project-card__badge project-card__badge--ongoing">
                  Ongoing
                <span className={`project-card__badge project-card__badge--${proj.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {proj.status}
                </span>
              </div>

              <div className="project-card__body">
                <div className="project-card__detail-row">
                  <span className="project-card__detail-label">Client Email</span>
                  <span className="project-card__detail-value">{proj.clientEmail || "Not provided"}</span>
                </div>
                <div className="project-card__detail-row">
                  <span className="project-card__detail-label">Total Budget</span>
                  <span className="project-card__detail-value">
                    {formatCurrency(proj.totalBudget, proj.budget)}
                  </span>
                </div>
                <div className="project-card__detail-row">
                  <span className="project-card__detail-label">Advance Payment</span>
                  <span className="project-card__detail-value">{formatAdvance(proj.advance)}</span>
                <div className="project-card__budget-row">
                  <span className="project-card__budget-label">Budget</span>
                  <span className="project-card__budget-value">${proj.budget.toLocaleString()}</span>
                </div>

                {proj.advanceAccepted && (
                  <div className="project-card__budget-row" style={{ marginTop: '0', fontSize: '0.85rem' }}>
                    <span className="project-card__budget-label">Advance</span>
                    <span className={proj.advanceReceivedAmount >= proj.advanceAmount ? 'text-success' : 'text-warning'}>
                      ${proj.advanceReceivedAmount.toLocaleString()} / ${proj.advanceAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="project-card__progress-container">
                  <div className="project-card__progress-header">
                    <span>Build Progress</span>
                    <span>{proj.progress}%</span>
                  </div>
                  <div className="project-card__progress-track">
                    <div
                      className="project-card__progress-bar"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="project-card__footer">
                <span>Due Date</span>
                <span>{formatDate(proj.dueDate)}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="projects-empty">
          <div className="projects-empty__icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h2 className="projects-empty__title">No projects found</h2>
          <p className="projects-empty__description">
            {searchQuery
              ? `No ongoing projects match "${searchQuery}". Try refining your search query.`
              : "No ongoing projects are available yet."}
            No active projects match your current view.
          </p>
        </div>
      )}

      {selectedProject && (
        <ProjectDetailsModal
          isOpen={!!selectedProjectId}
          project={selectedProject}
          onClose={() => setSelectedProjectId(null)}
          onActionSuccess={handleActionSuccess}
        />
      )}

      {toastMessage && (
        <div
          className="app__success-toast"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            top: "auto",
            left: "auto",
            zIndex: 110,
            width: "min(400px, calc(100% - 48px))",
            margin: 0,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          }}
          role="status"
        >
          {toastMessage}
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: `
        .text-success { color: var(--accent); font-weight: 600; }
        .text-warning { color: #fbbf24; font-weight: 600; }
      `}} />
    </div>
  );
}
