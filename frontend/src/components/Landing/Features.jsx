import React from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Briefcase, 
  Clock, 
  CreditCard, 
  FileText, 
  PieChart, 
  ShieldCheck, 
  Zap 
} from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="feature-card"
      style={{
        padding: "32px",
        background: "var(--bg-secondary)",
        borderRadius: "16px",
        border: "1px solid var(--border-color)",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        background: "var(--accent-soft)",
        color: "var(--accent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "24px",
      }}>
        <Icon size={24} />
      </div>
      <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "12px", color: "var(--text-primary)" }}>
        {title}
      </h3>
      <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
        {description}
      </p>
    </motion.div>
  );
};

const Features = () => {
  const features = [
    {
      icon: Briefcase,
      title: "Project Management",
      description: "Keep track of all your projects in one place. Organize by status, client, and deadline with ease."
    },
    {
      icon: FileText,
      title: "Smart Invoicing",
      description: "Professional invoices created and sent in seconds. Track when they're opened and when you get paid."
    },
    {
      icon: Zap,
      title: "Task Tracking",
      description: "Breaking down complex projects into actionable tasks. Never miss a milestone again."
    },
    {
      icon: CreditCard,
      title: "Payment Processing",
      description: "Accept credit cards, bank transfers, and international payments directly through SoloSync."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Understand your business health with beautiful charts showing income, expenses, and growth."
    },
    {
      icon: ShieldCheck,
      title: "Secure Workspace",
      description: "Your data is encrypted and backed up automatically. Focus on your work with peace of mind."
    }
  ];

  return (
    <section id="features" className="section-container" style={{ paddingBottom: "120px" }}>
      <div style={{ textAlign: "center", marginBottom: "72px" }}>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "20px", letterSpacing: "-0.03em" }}
        >
          Everything you need to <span style={{ color: "var(--accent)" }}>run your business</span>.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: "1.125rem", color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}
        >
          Stop jumping between apps. SoloSync is the all-in-one platform built specifically for the needs of modern freelancers.
        </motion.p>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
        gap: "32px" 
      }}>
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} index={index} />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .feature-card:hover {
          border-color: var(--accent) !important;
          transform: translateY(-8px);
          box-shadow: 0 20px 40px var(--shadow-color);
        }
      `}} />
    </section>
  );
};

export default Features;
