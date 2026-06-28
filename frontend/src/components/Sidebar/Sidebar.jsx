import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../Avatars/Avatars";
import "./Sidebar.css";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Current Projects", path: "/current-projects" },
  { label: "Closed Projects", path: "/closed-projects" },
  { label: "Payments", path: "/payments" },
  { label: "Invoices", path: "/invoices" },
  { label: "Reminders", path: "/reminders" },
];

export default function Sidebar({ isOpen, onClose }) {
  const panelRef = useRef(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`sidebar-backdrop ${isOpen ? "sidebar-backdrop--visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <nav
        ref={panelRef}
        className={`sidebar ${isOpen ? "sidebar--open" : ""}`}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
      >
        <div className="sidebar__header">
          <span className="sidebar__title">Menu</span>
          <button
            type="button"
            className="sidebar__close-button"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <ul className="sidebar__list">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
                }
              >
                <span className="sidebar__link-indicator" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {user && (
          <div className="sidebar__profile">
            <div className="sidebar__profile-user">
              <Avatar id={user.avatarId} size={38} className="sidebar__profile-avatar" />
              <div className="sidebar__profile-info">
                <span className="sidebar__profile-username">{user.username}</span>
                <span className="sidebar__profile-email">{user.email}</span>
              </div>
            </div>
            <button
              type="button"
              className="sidebar__logout-button"
              onClick={() => {
                if (window.confirm("Are you sure you want to log out of SoloSync?")) {
                  logout();
                  onClose();
                }
              }}
              aria-label="Log out"
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
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
