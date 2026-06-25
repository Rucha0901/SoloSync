import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar, { AVATARS } from "../components/Avatars/Avatars";
import "./Signup.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState(AVATARS[0].id);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Subtle timeout to simulate server check
    setTimeout(() => {
      const result = signup(username, email, password, selectedAvatarId);
      setIsSubmitting(false);

      if (result.success) {
        navigate("/");
      } else {
        setError(result.error);
      }
    }, 600);
  };

  return (
    <div className="auth-page">
      <div className="auth-card signup-card">
        <header className="auth-card__header">
          <div className="auth-card__logo">
            Solo<span className="auth-card__logo-accent">Sync</span>
          </div>
          <h1 className="auth-card__title">Create your account</h1>
          <p className="auth-card__subtitle">Organize and sync your freelance workspace</p>
        </header>

        {error && (
          <div className="auth-card__error" role="alert">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form className="auth-card__form" onSubmit={handleSubmit}>
          <div className="auth-card__field">
            <label className="auth-card__label" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="auth-card__input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="coder_sam"
              autoComplete="username"
              minLength={3}
              maxLength={20}
            />
          </div>

          <div className="auth-card__field">
            <label className="auth-card__label" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              className="auth-card__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="auth-card__field">
            <label className="auth-card__label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="auth-card__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          {/* Avatar Picker */}
          <div className="auth-card__field">
            <label className="auth-card__label">Choose profile icon</label>
            <span className="signup-card__avatar-subtitle">Select a cool custom avatar for your profile</span>
            <div className="signup-card__avatar-grid">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  className={`signup-card__avatar-btn ${
                    selectedAvatarId === avatar.id ? "signup-card__avatar-btn--selected" : ""
                  }`}
                  onClick={() => setSelectedAvatarId(avatar.id)}
                  title={avatar.name}
                  style={{ "--avatar-color": avatar.color }}
                >
                  <Avatar id={avatar.id} size={48} />
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="auth-card__button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <footer className="auth-card__footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-card__link">
            Sign in
          </Link>
        </footer>
      </div>
    </div>
  );
}
