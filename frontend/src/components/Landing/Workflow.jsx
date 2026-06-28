import React from "react";
import { motion } from "framer-motion";

const Step = ({ number, title, description, isLast }) => {
  return (
    <div style={{ display: "flex", gap: "24px", position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "var(--accent)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "700",
          fontSize: "1.1rem",
          zIndex: 2,
        }}>
          {number}
        </div>
        {!isLast && (
          <div style={{
            width: "2px",
            flex: 1,
            background: "linear-gradient(to bottom, var(--accent), var(--border-color))",
            margin: "8px 0",
            minHeight: "60px",
          }} />
        )}
      </div>
      <div style={{ paddingBottom: isLast ? "0" : "48px" }}>
        <h3 style={{ fontSize: "1.35rem", fontWeight: "700", marginBottom: "8px", color: "var(--text-primary)" }}>
          {title}
        </h3>
        <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: "1.6", maxWidth: "400px" }}>
          {description}
        </p>
      </div>
    </div>
  );
};

const Workflow = () => {
  const steps = [
    {
      title: "Set up your workspace",
      description: "Connect your bank accounts and set your branding in minutes. Your personal command center is ready."
    },
    {
      title: "Onboard your clients",
      description: "Send professional portals to your clients. They can see project progress and pay invoices in one click."
    },
    {
      title: "Track your progress",
      description: "Log hours, complete tasks, and watch your project move towards completion with visual milestones."
    },
    {
      title: "Get paid instantly",
      description: "Automatically generate invoices and receive funds directly in your bank account. No chasing checks."
    }
  ];

  return (
    <section id="workflow" style={{ background: "var(--bg-hover)", padding: "100px 0" }}>
      <div className="section-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "40px", letterSpacing: "-0.03em" }}>
            The workflow that <span style={{ color: "var(--accent)" }}>works for you</span>.
          </h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {steps.map((step, index) => (
              <Step 
                key={index} 
                number={index + 1} 
                title={step.title} 
                description={step.description} 
                isLast={index === steps.length - 1} 
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            background: "var(--bg-secondary)",
            borderRadius: "24px",
            padding: "40px",
            border: "1px solid var(--border-color)",
            boxShadow: "0 30px 60px rgba(0,0,0,0.1)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Visual representation of the workflow */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ height: "180px", background: "var(--accent-soft)", borderRadius: "12px", border: "1px dashed var(--accent)", padding: "20px" }}>
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", fontWeight: "600" }}>
                Interactive Workflow Visual
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
               <div style={{ height: "120px", background: "var(--bg-primary)", borderRadius: "12px", border: "1px solid var(--border-color)" }} />
               <div style={{ height: "120px", background: "var(--bg-primary)", borderRadius: "12px", border: "1px solid var(--border-color)" }} />
            </div>
            <div style={{ height: "100px", background: "var(--bg-primary)", borderRadius: "12px", border: "1px solid var(--border-color)", padding: "16px" }}>
               <div style={{ width: "80%", height: "10px", background: "var(--border-color)", borderRadius: "5px", marginBottom: "12px" }} />
               <div style={{ width: "60%", height: "10px", background: "var(--border-color)", borderRadius: "5px" }} />
            </div>
          </div>
          
          {/* Sparkle effect */}
          <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", background: "var(--accent)", filter: "blur(60px)", opacity: 0.2 }}></div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 991px) {
          #workflow .section-container {
            grid-template-columns: 1fr;
          }
        }
      `}} />
    </section>
  );
};

export default Workflow;
