import React from "react";
import { useProjects } from "../context/ProjectContext";
import "./Projects.css";

export default function CurrentProjects({ searchQuery = "" }) {
  const { projects } = useProjects();

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
                <span className={`project-card__badge project-card__badge--${proj.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {proj.status}
                </span>
              </div>

              <div className="project-card__body">
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
                <span>{proj.dueDate}</span>
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
            No active projects match your current view.
          </p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .text-success { color: var(--accent); font-weight: 600; }
        .text-warning { color: #fbbf24; font-weight: 600; }
      `}} />
    </div>
  );
}
