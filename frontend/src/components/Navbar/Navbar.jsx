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
        Freelance<span className="navbar__brand-accent">Flow</span>
      </span>

      <div className="navbar__spacer" />

      <ThemeToggle />
    </header>
  );
}
