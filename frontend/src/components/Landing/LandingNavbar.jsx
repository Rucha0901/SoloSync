import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import Logo from "../Logo/Logo";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Workflow", href: "#workflow" },
    { name: "Testimonials", href: "#testimonials" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-4 glass shadow-sm" : "py-6 bg-transparent"
      }`}
      style={{
        padding: isScrolled ? "1rem 2rem" : "1.5rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: isScrolled ? "1px solid var(--border-color)" : "1px solid transparent",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Logo size={32} />
        <span
          style={{
            fontSize: "1.25rem",
            fontWeight: "700",
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
          }}
        >
          Solo<span style={{ color: "var(--accent)" }}>Sync</span>
        </span>
      </div>

      {/* Desktop Links */}
      <div
        className="md-flex"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "32px",
        }}
      >
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            style={{
              fontSize: "0.95rem",
              fontWeight: "500",
              color: "var(--text-secondary)",
              transition: "color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.color = "var(--text-primary)")}
            onMouseOut={(e) => (e.target.style.color = "var(--text-secondary)")}
          >
            {link.name}
          </a>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <ThemeToggle />
        <div
          className="md-flex"
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
        >
          <Link
            to="/dashboard"
            style={{
              fontSize: "0.95rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              padding: "8px 16px",
            }}
          >
            Login
          </Link>
          <Link
            to="/dashboard"
            className="landing-button landing-button--primary"
            style={{ padding: "10px 20px", fontSize: "0.9rem" }}
          >
            Get Started <ArrowRight size={16} style={{ marginLeft: "8px" }} />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md-hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-primary)",
            cursor: "pointer",
          }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "var(--bg-secondary)",
              padding: "24px",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              zIndex: 49,
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "500",
                  color: "var(--text-primary)",
                }}
              >
                {link.name}
              </a>
            ))}
            <hr style={{ border: "none", borderTop: "1px solid var(--border-color)" }} />
            <Link
              to="/dashboard"
              style={{ fontSize: "1.1rem", fontWeight: "600" }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/dashboard"
              className="landing-button landing-button--primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default LandingNavbar;
