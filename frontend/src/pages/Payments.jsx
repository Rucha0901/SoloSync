import React, { useState, useMemo, lazy, Suspense } from "react";
import {
  useProjects,
  PAYMENT_STATUS,
  PAYMENT_TYPE,
} from "../context/ProjectContext";
import { MiniChart } from "../components/Charts/MiniChart";
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  Target,
  Bell,
  PlusCircle,
  Lock,
} from "lucide-react";
import "./Payments.css";

/* ─── Helpers ──────────────────────────────────────────────── */
function getStatusClass(status) {
  switch (status) {
    case PAYMENT_STATUS.PAID_IN_FULL:    return "paid";
    case PAYMENT_STATUS.ADVANCE_RECEIVED: return "advance";
    case PAYMENT_STATUS.ADVANCE_PENDING:  return "pending";
    case PAYMENT_STATUS.PARTIALLY_PAID:   return "partial";
    case PAYMENT_STATUS.OVERDUE:          return "overdue";
    default: return "pending";
  }
}

function fmt(n) {
  return "$" + Number(n).toLocaleString();
}

function pct(part, total) {
  if (!total) return 0;
  return Math.min(100, Math.round((part / total) * 100));
}

function dotClass(type) {
  if (type === PAYMENT_TYPE.ADVANCE)   return "timeline__dot--advance";
  if (type === PAYMENT_TYPE.FINAL)     return "timeline__dot--final";
  return "timeline__dot--milestone";
}

/* ─── Summary Card ────────────────────────────────────────── */
function SummaryCard({ label, value, subtext, icon: Icon, accentFooter }) {
  return (
    <div className="summary-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span className="summary-card__label">{label}</span>
        <div style={{
          padding: "8px",
          borderRadius: "10px",
          background: "var(--accent-soft)",
          color: "var(--accent)",
          flexShrink: 0,
        }}>
          <Icon size={18} />
        </div>
      </div>
      <span className="summary-card__value">{value}</span>
      {subtext && (
        <div className="summary-card__footer" style={accentFooter ? {} : { color: "var(--text-secondary)" }}>
          {accentFooter && <TrendingUp size={13} />}
          {subtext}
        </div>
      )}
    </div>
  );
}

/* ─── Record Payment Modal ────────────────────────────────── */
function RecordPaymentModal({ isOpen, onClose, project, onSave }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState(PAYMENT_TYPE.MILESTONE);

  if (!isOpen || !project) return null;

  const remaining = project.budget - project.totalPaid;

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0 || val > remaining) return;
    onSave(project.id, { amount: val, type });
    setAmount("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <h2 className="modal-title" style={{ marginBottom: "6px" }}>Record Payment</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "0 0 24px 0" }}>
          → {project.name} ({project.client})
        </p>

        {/* Quick info strip */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "10px",
          marginBottom: "24px",
          padding: "14px",
          background: "var(--bg-primary)",
          borderRadius: "8px",
          border: "1px solid var(--border-color)",
        }}>
          {[
            { label: "Budget", value: fmt(project.budget) },
            { label: "Paid", value: fmt(project.totalPaid) },
            { label: "Remaining", value: fmt(remaining) },
          ].map((m) => (
            <div key={m.label}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginBottom: "2px" }}>{m.label}</div>
              <div style={{ fontWeight: 700 }}>{m.value}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Payment Type</label>
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value={PAYMENT_TYPE.ADVANCE}>Advance Payment</option>
              <option value={PAYMENT_TYPE.MILESTONE}>Milestone / Progress</option>
              <option value={PAYMENT_TYPE.FINAL}>Final Settlement</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Amount (USD)</label>
            <input
              type="number"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Max ${fmt(remaining)}`}
              required
              min="1"
              max={remaining}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <PlusCircle size={15} style={{ marginRight: "6px" }} />
              Process Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Project Detail Card ─────────────────────────────────── */
function ProjectDetailCard({ project, onRecord }) {
  const paid = project.totalPaid;
  const budget = project.budget;
  const remaining = budget - paid;
  const payPct = pct(paid, budget);
  const advancePct = project.advanceAccepted ? pct(project.advanceAmount, budget) : 0;
  const isPaidFull = project.paymentStatus === PAYMENT_STATUS.PAID_IN_FULL;

  return (
    <div className="project-detail-card">
      {/* Card Header */}
      <div className="project-detail-card__header">
        <div>
          <h3 className="project-detail-card__title">{project.name}</h3>
          <p className="project-detail-card__client">{project.client}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span className={`status-tag status-tag--${getStatusClass(project.paymentStatus)}`}>
            {project.paymentStatus}
          </span>
          <button
            className="record-btn"
            onClick={() => onRecord(project)}
            disabled={isPaidFull}
            title={isPaidFull ? "Project fully paid" : "Record a payment"}
          >
            {isPaidFull ? <Lock size={13} /> : <PlusCircle size={13} />}
            {isPaidFull ? "Settled" : "Record"}
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="project-detail-card__body">
        {/* Left: Metrics Grid */}
        <div>
          <div className="metrics-grid">
            <div className="detail-metric">
              <div className="detail-metric__label">Total Budget</div>
              <div className="detail-metric__value">{fmt(budget)}</div>
            </div>
            <div className="detail-metric">
              <div className="detail-metric__label">Total Paid</div>
              <div className="detail-metric__value detail-metric__value--accent">{fmt(paid)}</div>
            </div>
            <div className="detail-metric">
              <div className="detail-metric__label">Remaining Balance</div>
              <div className={`detail-metric__value ${remaining > 0 ? "detail-metric__value--warning" : "detail-metric__value--accent"}`}>
                {fmt(remaining)}
              </div>
            </div>
            {project.advanceAccepted ? (
              <div className="detail-metric">
                <div className="detail-metric__label">Advance Req / Rcvd</div>
                <div className="detail-metric__value detail-metric__value--blue">
                  {fmt(project.advanceAmount)} / {fmt(project.advanceReceivedAmount)}
                </div>
              </div>
            ) : (
              <div className="detail-metric">
                <div className="detail-metric__label">Advance</div>
                <div className="detail-metric__value" style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  None requested
                </div>
              </div>
            )}
          </div>

          {/* Payment Progress Bar */}
          <div style={{ marginTop: "20px" }}>
            <div className="progress-label-row">
              <span>Payment Progress</span>
              <span style={{ fontWeight: 700, color: "var(--accent)" }}>{payPct}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-bar" style={{ width: `${payPct}%` }} />
              {project.advanceAccepted && advancePct > 0 && (
                <div
                  className="progress-marker"
                  style={{ left: `${advancePct}%` }}
                  title={`Advance target: ${fmt(project.advanceAmount)}`}
                />
              )}
            </div>
            {project.advanceAccepted && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px", fontSize: "0.72rem", color: "#fbbf24" }}>
                <div style={{ width: "10px", height: "3px", background: "#fbbf24", borderRadius: "2px" }} />
                Advance target at {fmt(project.advanceAmount)} ({advancePct}%)
              </div>
            )}
          </div>
        </div>

        {/* Right: Payment Timeline */}
        <div>
          <div className="timeline__title">Payment Timeline</div>
          <div className="timeline__list">
            {project.payments.length === 0 ? (
              <div className="timeline__empty">No payments recorded yet</div>
            ) : (
              [...project.payments].reverse().map((pay, i) => (
                <div key={pay.id || i} className="timeline__item">
                  <div className={`timeline__dot ${dotClass(pay.type)}`} />
                  <span className="timeline__type">{pay.type}</span>
                  <span className="timeline__amount" style={{
                    color: pay.type === PAYMENT_TYPE.ADVANCE ? "#60a5fa"
                         : pay.type === PAYMENT_TYPE.FINAL   ? "#a78bfa"
                         : "var(--accent)"
                  }}>
                    {fmt(pay.amount)}
                  </span>
                  <span className="timeline__date">{pay.date}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
export default function Payments() {
  const { projects, recordPayment } = useProjects();
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  /* Summary Metrics */
  const metrics = useMemo(() => {
    const now = new Date();
    const cm = now.getMonth(), cy = now.getFullYear();
    let totalRevenue = 0, monthlyRevenue = 0, pendingTotal = 0,
        totalBudget = 0, advanceReceived = 0;

    projects.forEach((p) => {
      totalRevenue   += p.totalPaid;
      pendingTotal   += p.budget - p.totalPaid;
      totalBudget    += p.budget;
      p.payments.forEach((pay) => {
        const d = new Date(pay.date);
        if (d.getMonth() === cm && d.getFullYear() === cy) monthlyRevenue += pay.amount;
        if (pay.type === PAYMENT_TYPE.ADVANCE) advanceReceived += pay.amount;
      });
    });
    return {
      totalRevenue,
      monthlyRevenue,
      pendingTotal,
      advanceReceived,
      collectionRate: totalBudget > 0 ? Math.round((totalRevenue / totalBudget) * 100) : 0,
    };
  }, [projects]);

  /* Chart Data (Last 6 Months) */
  const chartData = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        name: d.toLocaleString("default", { month: "short" }),
        mm: d.getMonth(),
        yy: d.getFullYear(),
        revenue: 0,
      };
    });
    projects.forEach((p) =>
      p.payments.forEach((pay) => {
        const pd = new Date(pay.date);
        const slot = months.find((m) => m.mm === pd.getMonth() && m.yy === pd.getFullYear());
        if (slot) slot.revenue += pay.amount;
      })
    );
    return months;
  }, [projects]);

  function openModal(proj) {
    setSelectedProject(proj);
    setIsModalOpen(true);
  }

  /* Derived lists */
  const received = projects.filter((p) => p.totalPaid > 0);
  const pending  = projects.filter((p) => p.totalPaid < p.budget);

  return (
    <div className="payments-page">
      {/* ── Page Header */}
      <header className="payments-page__header">
        <div>
          <h1 className="payments-page__title">Payments & Revenue</h1>
          <p className="payments-page__subtitle">
            Track your freelance income, outstanding balances, and financial growth
          </p>
        </div>
      </header>

      {/* ── Summary Cards */}
      <div className="payments-summary">
        <SummaryCard label="Total Revenue"   value={fmt(metrics.totalRevenue)}   subtext="Lifetime earnings"      icon={DollarSign}   accentFooter />
        <SummaryCard label="Monthly Revenue" value={fmt(metrics.monthlyRevenue)} subtext="This calendar month"   icon={TrendingUp}   accentFooter={metrics.monthlyRevenue > 0} />
        <SummaryCard label="Pending Balance" value={fmt(metrics.pendingTotal)}   subtext="Still to be collected" icon={Clock} />
        <SummaryCard label="Advance Received" value={fmt(metrics.advanceReceived)} subtext="Upfront secured"  icon={CheckCircle2} accentFooter={metrics.advanceReceived > 0} />
        <SummaryCard label="Collection Rate" value={`${metrics.collectionRate}%`} subtext="Budget converted to cash" icon={Target} accentFooter />
      </div>

      {/* ── Revenue Chart */}
      <div className="revenue-chart-container">
        <div className="revenue-chart-header">
          <h2 className="revenue-chart-title">Monthly Revenue (Last 6 Months)</h2>
        </div>
        <MiniChart data={chartData} height={280} />
      </div>

      {/* ── Received & Pending Tables */}
      <div className="payments-sections">
        {/* Payments Received */}
        <section className="payments-section">
          <div className="payments-section__header">
            <h2 className="payments-section__title">Payments Received</h2>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              {received.length} project{received.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="payments-table-container">
            {received.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
                No payments received yet.
              </div>
            ) : (
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>Project & Client</th>
                    <th>Total Fee</th>
                    <th>Advance Required</th>
                    <th>Total Paid</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {received.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="project-name-cell">
                          <span className="name">{p.name}</span>
                          <span className="client">{p.client}</span>
                        </div>
                      </td>
                      <td>{fmt(p.budget)}</td>
                      <td>
                        {p.advanceAccepted
                          ? <span style={{ color: "#60a5fa" }}>{fmt(p.advanceAmount)}</span>
                          : <span style={{ color: "var(--text-secondary)" }}>—</span>}
                      </td>
                      <td style={{ fontWeight: 700, color: "var(--accent)" }}>{fmt(p.totalPaid)}</td>
                      <td>
                        <span className={`status-tag status-tag--${getStatusClass(p.paymentStatus)}`}>
                          {p.paymentStatus}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {p.paymentStatus !== PAYMENT_STATUS.PAID_IN_FULL && (
                          <button className="record-btn" onClick={() => openModal(p)}>
                            + Record
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Pending Payments */}
        <section className="payments-section">
          <div className="payments-section__header">
            <h2 className="payments-section__title">Pending Payments</h2>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              {pending.length} outstanding
            </span>
          </div>
          <div className="payments-table-container">
            {pending.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--accent)", fontWeight: 600 }}>
                🎉 All projects are fully paid!
              </div>
            ) : (
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>Project & Client</th>
                    <th>Remaining Amount</th>
                    <th>Due Date</th>
                    <th>Collection Progress</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((p) => {
                    const remaining = p.budget - p.totalPaid;
                    const collected = pct(p.totalPaid, p.budget);
                    const isOverdue = p.paymentStatus === PAYMENT_STATUS.OVERDUE;
                    return (
                      <tr key={p.id}>
                        <td>
                          <div className="project-name-cell">
                            <span className="name">{p.name}</span>
                            <span className="client">{p.client}</span>
                          </div>
                        </td>
                        <td style={{ fontWeight: 700, color: isOverdue ? "#f87171" : "#fbbf24" }}>
                          {fmt(remaining)}
                        </td>
                        <td style={{ color: isOverdue ? "#f87171" : "var(--text-primary)" }}>
                          {p.dueDate}
                          {isOverdue && (
                            <span style={{ marginLeft: "6px", fontSize: "0.7rem", background: "rgba(239,68,68,0.15)", color: "#f87171", padding: "2px 6px", borderRadius: "4px" }}>
                              Overdue
                            </span>
                          )}
                        </td>
                        <td style={{ minWidth: "160px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div className="progress-track">
                              <div className="progress-bar" style={{ width: `${collected}%` }} />
                            </div>
                            <span style={{ fontSize: "0.78rem", fontWeight: 700, minWidth: "32px" }}>
                              {collected}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              className="record-btn"
                              onClick={() => openModal(p)}
                            >
                              + Record
                            </button>
                            <button
                              className="reminder-btn"
                              onClick={() => alert(`✉️ Reminder sent to ${p.client} for "${p.name}".`)}
                            >
                              <Bell size={13} /> Remind
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      {/* ── Project-wise Payment Details */}
      <div className="project-details-section">
        <h2 className="project-details-section__heading">Project-wise Payment Details</h2>
        <div className="project-detail-cards">
          {projects.map((p) => (
            <ProjectDetailCard key={p.id} project={p} onRecord={openModal} />
          ))}
        </div>
      </div>

      {/* ── Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
        onSave={recordPayment}
      />
    </div>
  );
}
