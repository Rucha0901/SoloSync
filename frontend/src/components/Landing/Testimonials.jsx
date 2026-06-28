import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TestimonialCard = ({ content, author, role, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        padding: "40px",
        background: "var(--bg-secondary)",
        borderRadius: "24px",
        border: "1px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", gap: "4px", color: "#f59e0b" }}>
        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" />)}
      </div>
      <p style={{ fontSize: "1.1rem", color: "var(--text-primary)", lineHeight: "1.6", fontStyle: "italic" }}>
        "{content}"
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "auto" }}>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "var(--accent-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "700",
          color: "var(--accent)",
          fontSize: "1rem"
        }}>
          {author[0]}
        </div>
        <div>
          <div style={{ fontWeight: "700", color: "var(--text-primary)" }}>{author}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{role}</div>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      content: "SoloSync has completely transformed how I run my freelance business. I used to spend hours on invoicing, now it takes minutes.",
      author: "Sarah Jenkins",
      role: "UX Designer"
    },
    {
      content: "The analytics are a game changer. For the first time, I actually know where my money is going and which projects are most profitable.",
      author: "Michael Chen",
      role: "Full-stack Developer"
    },
    {
      content: "The interface is so beautiful and clean. It's the only project management tool I actually enjoy opening every morning.",
      author: "Elena Rodriguez",
      role: "Digital Marketer"
    }
  ];

  return (
    <section id="testimonials" style={{ paddingBottom: "120px" }}>
      <div className="section-container">
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "20px" }}
          >
            Loved by <span style={{ color: "var(--accent)" }}>freelancers everywhere</span>.
          </motion.h2>
          <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
            Don't just take our word for it. Here's what our community has to say about SoloSync.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "32px"
        }}>
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
