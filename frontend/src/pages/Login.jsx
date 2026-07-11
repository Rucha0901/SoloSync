import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Subtle timeout to simulate server check
    setTimeout(() => {
      const result = login(email, password);
      setIsSubmitting(false);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error);
      }
    }, 600);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-card__header">
          <div className="auth-card__logo">
            Solo<span className="auth-card__logo-accent">Sync</span>
          </div>
          <h1 className="auth-card__title">Welcome back</h1>
          <p className="auth-card__subtitle">Sign in to manage your freelance business</p>
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
            <label className="auth-card__label" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              className="auth-card__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
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
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="auth-card__button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <footer className="auth-card__footer">
          Don't have an account?{" "}
          <Link to="/signup" className="auth-card__link">
            Create one now
          </Link>
        </footer>
      </div>
    </div>
  );
}
