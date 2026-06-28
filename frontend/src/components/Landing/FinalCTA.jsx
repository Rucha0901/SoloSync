import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="section-container" style={{ paddingBottom: "120px" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          background: "var(--accent)",
          color: "white",
          borderRadius: "32px",
          padding: "80px 40px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 40px 100px var(--accent-soft)",
        }}
      >
        {/* Subtle background decoration */}
        <div style={{ position: "absolute", top: "-100px", left: "-100px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "-100px", right: "-100px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", filter: "blur(60px)" }} />
        
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.2)", padding: "8px 16px", borderRadius: "100px", fontSize: "0.9rem", fontWeight: "600", marginBottom: "32px" }}>
            <Sparkles size={16} /> Ready to scale?
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: "800", marginBottom: "24px", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
            Ready to take control of <br /> your freelance business?
          </h2>
          <p style={{ fontSize: "1.25rem", opacity: 0.9, maxWidth: "600px", margin: "0 auto 48px", lineHeight: 1.6 }}>
            Join thousands of freelancers who are growing their business with SoloSync. Start your 14-day free trial today.
          </p>
          
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/dashboard" className="landing-button" style={{ background: "white", color: "var(--accent)", height: "64px", padding: "0 40px", fontSize: "1.1rem" }}>
              Start for Free <ArrowRight size={20} style={{ marginLeft: "12px" }} />
            </Link>
            <button className="landing-button" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", color: "white", height: "64px", padding: "0 40px", fontSize: "1.1rem" }}>
              Contact Sales
            </button>
          </div>
          
          <p style={{ marginTop: "32px", fontSize: "0.9rem", opacity: 0.7 }}>
            No credit card required. Cancel anytime.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default FinalCTA;
