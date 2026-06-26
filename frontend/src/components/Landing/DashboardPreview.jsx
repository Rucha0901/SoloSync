import React from "react";
import { motion } from "framer-motion";
import { Search, Bell, Settings, Filter, Plus } from "lucide-react";

const DashboardPreview = () => {
  return (
    <section className="section-container" style={{ padding: "120px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: "80px" }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "20px" }}
        >
          A dashboard that <span style={{ color: "var(--accent)" }}>actually makes sense</span>.
        </motion.h2>
        <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", maxWidth: "800px", margin: "0 auto" }}>
          Built with focus in mind. See your entire business at a glance without the clutter of traditional tools.
        </p>
      </div>

      <div style={{
        background: "var(--bg-secondary)",
        borderRadius: "24px",
        border: "1px solid var(--border-color)",
        overflow: "hidden",
        boxShadow: "0 50px 100px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        height: "600px",
      }}>
        {/* Fake App Navbar */}
        <div style={{
          height: "64px",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: "24px"
        }}>
          <div style={{ fontWeight: "700", fontSize: "1.1rem" }}>Workspace</div>
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
             <div style={{ width: "300px", height: "36px", background: "var(--bg-primary)", borderRadius: "8px", display: "flex", alignItems: "center", padding: "0 12px", gap: "8px", color: "var(--text-secondary)" }}>
                <Search size={16} />
                <span style={{ fontSize: "0.85rem" }}>Search everything...</span>
             </div>
          </div>
          <div style={{ display: "flex", gap: "16px", color: "var(--text-secondary)" }}>
             <Bell size={20} />
             <Settings size={20} />
             <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: "700" }}>JD</div>
          </div>
        </div>

        <div style={{ display: "flex", flex: 1 }}>
          {/* Fake Sidebar */}
          <div style={{ width: "240px", borderRight: "1px solid var(--border-color)", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {["Dashboard", "Projects", "Invoices", "Clients", "Payments", "Reports"].map((item, i) => (
              <div key={i} style={{ 
                padding: "10px 16px", 
                borderRadius: "8px", 
                background: i === 1 ? "var(--accent-soft)" : "transparent",
                color: i === 1 ? "var(--accent)" : "var(--text-secondary)",
                fontWeight: i === 1 ? "600" : "500",
                fontSize: "0.9rem"
              }}>
                {item}
              </div>
            ))}
          </div>

          {/* Fake App Content */}
          <div style={{ flex: 1, padding: "32px", background: "var(--bg-primary)", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Active Projects</h3>
              <div style={{ display: "flex", gap: "12px" }}>
                <button style={{ height: "36px", padding: "0 16px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}>
                   <Filter size={14} /> Filter
                </button>
                <button style={{ height: "36px", padding: "0 16px", borderRadius: "6px", border: "none", background: "var(--accent)", color: "white", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", fontWeight: "600" }}>
                   <Plus size={14} /> New Project
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              {[1, 2].map(i => (
                <div key={i} style={{ 
                  background: "var(--bg-secondary)", 
                  padding: "24px", 
                  borderRadius: "12px", 
                  border: "1px solid var(--border-color)",
                  boxShadow: "0 4px 12px var(--shadow-color)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div style={{ width: "80px", height: "10px", background: "var(--accent-soft)", borderRadius: "4px" }} />
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--bg-hover)" }} />
                  </div>
                  <div style={{ width: "60%", height: "20px", background: "var(--border-color)", borderRadius: "4px", marginBottom: "12px" }} />
                  <div style={{ width: "40%", height: "12px", background: "var(--bg-hover)", borderRadius: "4px", marginBottom: "24px" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", marginLeft: "8px" }}>
                       {[1, 2, 3].map(j => (
                         <div key={j} style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--bg-hover)", border: "2px solid var(--bg-secondary)", marginLeft: "-8px" }} />
                       ))}
                    </div>
                    <div style={{ width: "60px", height: "10px", background: "var(--accent-soft)", borderRadius: "4px" }} />
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: "32px", padding: "24px", background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
               <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                 <div style={{ fontWeight: "600" }}>Revenue Growth</div>
                 <div style={{ fontSize: "0.8rem", color: "var(--accent)" }}>+24% this month</div>
               </div>
               <div style={{ height: "140px", display: "flex", alignItems: "flex-end", gap: "12px" }}>
                  {[40, 60, 30, 80, 50, 90, 70, 85].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      style={{ flex: 1, background: i === 5 ? "var(--accent)" : "var(--accent-soft)", borderRadius: "4px 4px 0 0" }} 
                    />
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
