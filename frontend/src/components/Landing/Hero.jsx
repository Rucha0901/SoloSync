import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section 
      style={{ 
        paddingTop: "160px",
        paddingBottom: "100px",
        background: "radial-gradient(circle at top right, var(--accent-soft), transparent 40%), radial-gradient(circle at bottom left, var(--accent-soft), transparent 40%)",
      }}
      className="section-container"
    >
      <div style={{ textAlign: "center", marginBottom: "80px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span style={{
            display: "inline-block",
            padding: "8px 16px",
            background: "var(--accent-soft)",
            color: "var(--accent)",
            borderRadius: "100px",
            fontSize: "0.875rem",
            fontWeight: "600",
            marginBottom: "24px",
            border: "1px solid var(--accent)",
          }}>
            Trusted by 5,000+ Freelancers
          </span>
          <h1 className="landing-title" style={{ maxWidth: "900px", margin: "0 auto 24px" }}>
            One workspace for every <span style={{ color: "var(--accent)" }}>freelance</span> project.
          </h1>
          <p className="landing-subtitle" style={{ margin: "0 auto 40px" }}>
            SoloSync combines project management, invoicing, and analytics into a single, beautiful interface. Focus on your work, not your tools.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link to="/dashboard" className="landing-button landing-button--primary" style={{ height: "56px", padding: "0 32px", fontSize: "1.1rem" }}>
              Start for Free <ArrowRight size={20} style={{ marginLeft: "12px" }} />
            </Link>
            <button className="landing-button landing-button--secondary" style={{ height: "56px", padding: "0 32px", fontSize: "1.1rem" }}>
              <Play size={20} style={{ marginRight: "12px", fill: "currentColor" }} /> Watch Demo
            </button>
          </div>

          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "24px", 
            marginTop: "40px",
            color: "var(--text-secondary)",
            fontSize: "0.9rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle2 size={16} color="var(--accent)" /> No credit card required
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle2 size={16} color="var(--accent)" /> Cancel anytime
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Dashboard Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          position: "relative",
          maxWidth: "1100px",
          margin: "0 auto",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.2)",
          border: "1px solid var(--border-color)",
          background: "var(--bg-secondary)",
        }}
      >
        <div style={{
          height: "40px",
          background: "var(--bg-hover)",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: "8px"
        }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f56" }} />
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27c93f" }} />
        </div>
        <div style={{ padding: "0", position: "relative" }}>
          {/* We'll use a CSS-based mockup of the dashboard */}
          <div style={{ height: "600px", padding: "32px", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
             <div style={{ border: "1px solid var(--border-color)", borderRadius: "12px", padding: "20px" }}>
                <div style={{ width: "40%", height: "20px", background: "var(--bg-hover)", marginBottom: "20px" }} />
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--accent-soft)" }} />
                    <div style={{ flex: 1 }}>
                       <div style={{ width: "80%", height: "12px", background: "var(--bg-hover)", marginBottom: "6px" }} />
                       <div style={{ width: "50%", height: "8px", background: "var(--bg-hover)" }} />
                    </div>
                  </div>
                ))}
             </div>
             <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: "24px" }}>
                <div style={{ border: "1px solid var(--border-color)", borderRadius: "12px", padding: "20px", display: "flex", justifyContent: "space-between" }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ width: "30%" }}>
                       <div style={{ width: "60%", height: "10px", background: "var(--bg-hover)", marginBottom: "12px" }} />
                       <div style={{ width: "90%", height: "24px", background: "var(--accent-soft)", borderRadius: "4px" }} />
                    </div>
                  ))}
                </div>
                <div style={{ border: "1px solid var(--border-color)", borderRadius: "12px", padding: "20px" }}>
                   <div style={{ width: "30%", height: "15px", background: "var(--bg-hover)", marginBottom: "20px" }} />
                   <div style={{ width: "100%", height: "120px", background: "linear-gradient(to bottom, var(--accent-soft), transparent)", borderRadius: "8px", border: "1px dashed var(--accent)" }} />
                </div>
             </div>
          </div>
          
          {/* Floating elements for extra premium feel */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              bottom: "40px",
              right: "-40px",
              width: "280px",
              background: "var(--bg-secondary)",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
              border: "1px solid var(--border-color)",
              zIndex: 10
            }}
          >
            <div style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "12px" }}>Invoice Paid</div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>💰</div>
              <div>
                <div style={{ fontSize: "1.1rem", fontWeight: "700" }}>$2,450.00</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>from Acme Corp</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
