import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar, { AVATARS } from "../components/Avatars/Avatars";
import "./Profile.css";

export default function Profile() {
  const { user, updateAvatar } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (!user) return null;

  const handleAvatarSelect = (avatarId) => {
    const result = updateAvatar(avatarId);
    if (result.success) {
      setSuccessMessage("Profile icon updated successfully.");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <header className="profile-card__header">
          <Link to="/" className="profile-card__back-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="profile-card__title">Profile Settings</h1>
          <p className="profile-card__subtitle">Manage your personal identity on SoloSync</p>
        </header>

        {successMessage && (
          <div className="profile-card__success-banner">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        <section className="profile-card__user-section">
          <div className="profile-card__avatar-preview-container">
            <Avatar id={user.avatarId} size={72} className="profile-card__avatar-preview" />
            <span className="profile-card__avatar-badge">Active</span>
          </div>
          <div className="profile-card__user-details">
            <div className="profile-card__detail-item">
              <span className="profile-card__detail-label">Username</span>
              <span className="profile-card__detail-value">{user.username}</span>
            </div>
            <div className="profile-card__detail-item">
              <span className="profile-card__detail-label">Email Address</span>
              <span className="profile-card__detail-value">{user.email}</span>
            </div>
          </div>
        </section>

        <section className="profile-card__avatar-section">
          <h2 className="profile-card__section-title">Change Profile Icon</h2>
          <p className="profile-card__section-subtitle">Click on any icon below to instantly update your profile picture</p>
          <div className="profile-card__avatar-grid">
            {AVATARS.map((avatar) => (
              <button
                key={avatar.id}
                type="button"
                className={`profile-card__avatar-btn ${
                  user.avatarId === avatar.id ? "profile-card__avatar-btn--active" : ""
                }`}
                onClick={() => handleAvatarSelect(avatar.id)}
                title={avatar.name}
                style={{ "--avatar-color": avatar.color }}
              >
                <Avatar id={avatar.id} size={48} />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
