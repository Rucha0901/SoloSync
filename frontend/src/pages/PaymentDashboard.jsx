import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, DollarSign, WalletCards } from "lucide-react";
import {
  PAYMENT_STORAGE_KEY,
  PAYMENT_UPDATED_EVENT,
  calculatePaymentSummary,
  getPaymentProjects,
} from "../services/paymentService";
import "./PaymentDashboard.css";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatCurrency(value) {
  return currencyFormatter.format(value);
}

function getPaymentStatus(project) {
  if (project.isCompleted && project.paymentReceived) {
    return { label: "Paid", type: "paid" };
  }

  if (project.advancePaid > 0) {
    return { label: "Partial", type: "partial" };
  }

  return { label: "Pending", type: "pending" };
}

export default function PaymentDashboard() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function refreshProjects() {
      setProjects(getPaymentProjects());
      setIsLoading(false);
    }

    refreshProjects();

    function handleStorage(event) {
      if (!event.key || event.key === PAYMENT_STORAGE_KEY) {
        refreshProjects();
      }
    }

    window.addEventListener(PAYMENT_UPDATED_EVENT, refreshProjects);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(PAYMENT_UPDATED_EVENT, refreshProjects);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const summary = useMemo(() => calculatePaymentSummary(projects), [projects]);
  const hasPaymentData = projects.length > 0;

  const dashboardCards = [
    {
      label: "Current Month Income",
      value: summary.currentMonthIncome,
      hint: "Advance and final payments received this month",
      icon: DollarSign,
      type: "income",
    },
    {
      label: "Pending Payments",
      value: summary.pendingPayments,
      hint: "Remaining balances on unpaid projects",
      icon: Clock3,
      type: "pending",
    },
    {
      label: "Completed Payments",
      value: summary.completedPayments,
      hint: "Fully paid completed project value",
      icon: CheckCircle2,
      type: "completed",
    },
  ];

  return (
    <div className="payment-dashboard">
      <header className="payment-dashboard__header">
        <div>
          <span className="payment-dashboard__eyebrow">Payments</span>
          <h1 className="payment-dashboard__title">Payment Dashboard</h1>
          <p className="payment-dashboard__subtitle">
            Track incoming revenue, outstanding balances, and completed project payments.
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="payment-dashboard__state">Loading payment data...</div>
      ) : hasPaymentData ? (
        <>
          <section className="payment-dashboard__cards" aria-label="Payment summary">
            {dashboardCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.label}
                  className={`payment-dashboard__card payment-dashboard__card--${card.type}`}
                >
                  <div className="payment-dashboard__card-header">
                    <span className="payment-dashboard__card-label">{card.label}</span>
                    <span className="payment-dashboard__card-icon" aria-hidden="true">
                      <Icon size={18} strokeWidth={2.2} />
                    </span>
                  </div>
                  <strong className="payment-dashboard__card-value">
                    {formatCurrency(card.value)}
                  </strong>
                  <span className="payment-dashboard__card-hint">{card.hint}</span>
                </article>
              );
            })}
          </section>

          <section className="payment-dashboard__section">
            <div className="payment-dashboard__section-header">
              <div>
                <h2 className="payment-dashboard__section-title">Project Payments</h2>
                <p className="payment-dashboard__section-subtitle">
                  Balances update from each project's total, advance, completion, and payment status.
                </p>
              </div>
            </div>

            <div className="payment-dashboard__table" role="table" aria-label="Project payment details">
              <div className="payment-dashboard__table-row payment-dashboard__table-row--head" role="row">
                <span role="columnheader">Project</span>
                <span role="columnheader">Total</span>
                <span role="columnheader">Advance</span>
                <span role="columnheader">Balance</span>
                <span role="columnheader">Status</span>
              </div>

              {projects.map((project) => {
                const totalAmount = Number(project.totalAmount) || 0;
                const advancePaid = Number(project.advancePaid) || 0;
                const balance = project.paymentReceived ? 0 : Math.max(totalAmount - advancePaid, 0);
                const status = getPaymentStatus(project);

                return (
                  <div key={project.id} className="payment-dashboard__table-row" role="row">
                    <div className="payment-dashboard__project" role="cell">
                      <span className="payment-dashboard__project-name">{project.name}</span>
                      <span className="payment-dashboard__project-client">{project.client}</span>
                    </div>
                    <span role="cell">{formatCurrency(totalAmount)}</span>
                    <span role="cell">{formatCurrency(advancePaid)}</span>
                    <span role="cell">{formatCurrency(balance)}</span>
                    <span
                      className={`payment-dashboard__status payment-dashboard__status--${status.type}`}
                      role="cell"
                    >
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      ) : (
        <div className="payment-dashboard__empty">
          <div className="payment-dashboard__empty-icon" aria-hidden="true">
            <WalletCards size={26} strokeWidth={2} />
          </div>
          <h2 className="payment-dashboard__empty-title">No payment data yet</h2>
          <p className="payment-dashboard__empty-description">
            Add project amounts, advances, and payment statuses to populate this dashboard.
          </p>
        </div>
      )}
    </div>
  );
}

