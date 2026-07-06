import { useEffect, useState } from "react";
import { PROJECTS_UPDATED_EVENT, getProjects } from "../services/scheduleService";
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

export default function ClosedProjects({ searchQuery = "" }) {
  const [projects, setProjects] = useState(() => getProjects());

  useEffect(() => {
    const refreshProjects = () => setProjects(getProjects());

    window.addEventListener(PROJECTS_UPDATED_EVENT, refreshProjects);
    return () => window.removeEventListener(PROJECTS_UPDATED_EVENT, refreshProjects);
  }, []);

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredProjects = projects.filter((proj) => {
    const searchable = `${proj.name || ""} ${proj.client || ""}`.toLowerCase();
    return isClosedProject(proj) && searchable.includes(normalizedSearch);
  });

  return (
    <div className="projects-page">
      <header className="projects-page__header">
        <h1 className="projects-page__title">Closed Projects</h1>
        <p className="projects-page__subtitle">
          Review your archived client contracts and past project successes
        </p>
      </header>

      {filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map((proj) => (
            <article key={proj.id} className="project-card">
              <div className="project-card__header">
                <div className="project-card__title-container">
                  <h2 className="project-card__title" title={proj.name}>
                    {proj.name}
                  </h2>
                  <span className="project-card__client" title={proj.client}>
                    {proj.client}
                  </span>
                </div>
                <span className="project-card__badge project-card__badge--closed">
                  Closed
                </span>
              </div>

              <div className="project-card__body">
                <div className="project-card__detail-row">
                  <span className="project-card__detail-label">Total Budget</span>
                  <span className="project-card__detail-value">
                    {formatCurrency(proj.totalBudget, proj.budget)}
                  </span>
                </div>
              </div>

              <div className="project-card__footer">
                <span>Completion Date</span>
                <span>{formatDate(proj.completedDate || proj.completionDate || proj.dueDate)}</span>
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
              ? `No closed projects match "${searchQuery}". Try refining your search query.`
              : "Closed projects will appear here once projects are completed."}
          </p>
        </div>
      )}
    </div>
  );
}
