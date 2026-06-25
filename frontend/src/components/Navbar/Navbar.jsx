import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Navbar.css";

export default function Navbar({ onMenuClick }) {
  return (
    <header className="navbar">
      <button
        type="button"
        className="navbar__menu-button"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <span className="navbar__brand">
        Solo<span className="navbar__brand-accent">Sync</span>
      </span>

      <div className="navbar__spacer" />

      <button
        type="button"
        className="navbar__new-project-button"
        onClick={() => alert("New project creation will be implemented in the next phase.")}
        aria-label="Create new project"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="navbar__new-project-button-icon"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span className="navbar__new-project-button-text">New Project</span>
      </button>

      <ThemeToggle />
    </header>
  );
}
