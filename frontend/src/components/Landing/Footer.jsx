import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin, Instagram, ArrowUpRight } from "lucide-react";
import Logo from "../Logo/Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Integrations", "Changelog", "Docs"]
    },
    {
      title: "Company",
      links: ["About", "Careers", "Blog", "Press", "Contact"]
    },
    {
      title: "Legal",
      links: ["Privacy", "Terms", "Security", "Cookies"]
    }
  ];

  return (
    <footer style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border-color)", padding: "80px 0 40px" }}>
      <div className="section-container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "64px", marginBottom: "80px" }}>
          {/* Brand Column */}
          <div style={{ gridColumn: "span 2" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <Logo size={32} />
              <span style={{ fontSize: "1.25rem", fontWeight: "700", letterSpacing: "-0.02em" }}>
                Solo<span style={{ color: "var(--accent)" }}>Sync</span>
              </span>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", maxWidth: "320px", marginBottom: "32px" }}>
              The all-in-one workspace for the modern freelancer. Built with love for the creative community.
            </p>
            <div style={{ display: "flex", gap: "16px", color: "var(--text-secondary)" }}>
              {[Twitter, Github, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" style={{ transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "var(--accent)"} onMouseOut={e => e.currentTarget.style.color = "var(--text-secondary)"}>
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((column, i) => (
            <div key={i}>
              <h4 style={{ fontWeight: "700", marginBottom: "24px", color: "var(--text-primary)" }}>{column.title}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {column.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" style={{ color: "var(--text-secondary)", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "4px", transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "var(--accent)"} onMouseOut={e => e.currentTarget.style.color = "var(--text-secondary)"}>
                      {link}
                      {link === "Blog" && <ArrowUpRight size={12} />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            &copy; {currentYear} SoloSync Inc. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} />
              All systems operational
            </span>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          footer .section-container > div:first-child {
            grid-template-columns: 1fr 1fr;
          }
          footer .section-container > div:first-child > div:first-child {
            grid-column: span 2;
          }
        }
      `}} />
    </footer>
  );
};

export default Footer;
