import { Link } from "react-router-dom";
import "./Projects.css";

export default function ClosedProjects({ searchQuery = "" }) {
  const projects = [
    {
      id: "proj-101",
      name: "E-Commerce Platform Redesign",
      client: "Globex Corp",
      status: "Completed",
      statusType: "completed",
      budget: "$12,500",
      progress: 100,
      completedDate: "May 12, 2026",
    },
    {
      id: "proj-102",
      name: "Security Audit & Hotfixes",
      client: "Umbrella Corp",
      status: "Completed",
      statusType: "completed",
      budget: "$3,800",
      progress: 100,
      completedDate: "April 25, 2026",
    },
    {
      id: "proj-103",
      name: "SEO Optimization Campaign",
      client: "Initech",
      status: "Completed",
      statusType: "completed",
      budget: "$1,500",
      progress: 100,
      completedDate: "March 10, 2026",
    },
  ];

  // Filter projects by name or client (case-insensitive)
  const filteredProjects = projects.filter(
    (proj) =>
      proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <span className={`project-card__badge project-card__badge--${proj.statusType}`}>
                  {proj.status}
                </span>
              </div>

              <div className="project-card__body">
                <div className="project-card__budget-row">
                  <span className="project-card__budget-label">Revenue Earned</span>
                  <span className="project-card__budget-value">{proj.budget}</span>
                </div>

                <div className="project-card__progress-container">
                  <div className="project-card__progress-header">
                    <span>Progress</span>
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
                <span>Completed On</span>
                <span>{proj.completedDate}</span>
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
            No completed projects match "{searchQuery}". Try refining your search query.
          </p>
        </div>
      )}
    </div>
  );
}
