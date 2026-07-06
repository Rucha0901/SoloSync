import { useEffect, useMemo, useState } from "react";
import { X, Calendar, User, Mail, DollarSign, CheckCircle2, Clock, ShieldAlert } from "lucide-react";
import { markProjectCompleted } from "../../services/scheduleService";
import { getPaymentProjects, markPaymentCompleted, PAYMENT_UPDATED_EVENT } from "../../services/paymentService";
import "./ProjectDetailsModal.css";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatCurrency(value) {
  if (value === undefined || value === null) return "$0";
  return currencyFormatter.format(value);
}

function formatDate(value) {
  if (!value) return "Not set";
  return new Date(`${value}T00:00`).toLocaleDateString([], {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProjectDetailsModal({ isOpen, onClose, project, onActionSuccess }) {
  const [paymentProjects, setPaymentProjects] = useState(() => getPaymentProjects());

  // Listen to payment updates in case payment state changes
  useEffect(() => {
    function refreshPayments() {
      setPaymentProjects(getPaymentProjects());
    }
    window.addEventListener(PAYMENT_UPDATED_EVENT, refreshPayments);
    return () => window.removeEventListener(PAYMENT_UPDATED_EVENT, refreshPayments);
  }, []);

  // Listen to Escape key to close the modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const paymentProj = useMemo(() => {
    if (!project) return null;
    return paymentProjects.find((p) => p.id === project.id);
  }, [paymentProjects, project]);

  if (!isOpen || !project) {
    return null;
  }

  // Deduce total budget
  const totalBudget = project.totalBudget || (project.budget ? Number(project.budget.replace(/[^0-9]/g, "")) : 0);

  // Status determinations
  const isProjectDone =
    project.status?.toLowerCase() === "completed" ||
    project.status?.toLowerCase() === "closed" ||
    project.progress === 100 ||
    paymentProj?.isCompleted === true;

  const isPaymentPaid = paymentProj?.paymentReceived === true;

  const paymentStatus = (() => {
    if (isPaymentPaid) {
      return { label: "Paid", type: "paid" };
    }
    if (paymentProj?.advancePaid > 0) {
      return { label: "Partial", type: "partial" };
    }
    return { label: "Pending", type: "pending" };
  })();

  const advanceDetail = (() => {
    if (project.advance?.requested) {
      const amount = formatCurrency(project.advance.amount);
      const detail =
        project.advance.type === "percentage"
          ? `${project.advance.value}%`
          : formatCurrency(project.advance.value);
      return `${amount} (${detail})`;
    }
    if (paymentProj?.advancePaid > 0) {
      return formatCurrency(paymentProj.advancePaid);
    }
    return "No advance requested";
  })();

  const remainingBalance = isPaymentPaid ? 0 : Math.max(totalBudget - (paymentProj?.advancePaid || 0), 0);

  const handleMarkCompleted = () => {
    if (isProjectDone) return;
    markProjectCompleted(project.id);
    if (onActionSuccess) {
      onActionSuccess(`Project "${project.name}" has been marked as Completed!`);
    }
  };

  const handlePaymentCompleted = () => {
    if (isPaymentPaid) return;
    markPaymentCompleted(project.id);
    if (onActionSuccess) {
      onActionSuccess(`Payment for "${project.name}" has been marked as Completed!`);
    }
  };

  return (
    <div className="project-details-modal" role="dialog" aria-modal="true" aria-labelledby="project-details-title">
      <button type="button" className="project-details-modal__backdrop" onClick={onClose} aria-label="Close modal" />

      <article className="project-details-modal__panel">
        <header className="project-details-modal__header">
          <div className="project-details-modal__title-section">
            <h2 id="project-details-title" className="project-details-modal__title" title={project.name}>
              {project.name}
            </h2>
            <div className="project-details-modal__badges">
              <span
                className={`project-details-modal__badge project-details-modal__badge--project-${
                  isProjectDone ? "completed" : "ongoing"
                }`}
              >
                {isProjectDone ? "Completed" : "Ongoing"}
              </span>
              <span className={`project-details-modal__badge project-details-modal__badge--payment-${paymentStatus.type}`}>
                {paymentStatus.label}
              </span>
            </div>
          </div>
          <button type="button" className="project-details-modal__close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </header>

        <section className="project-details-modal__content">
          <div className="project-details-modal__section">
            <h3 className="project-details-modal__section-title">
              <User size={16} /> Client Information
            </h3>
            <div className="project-details-modal__grid">
              <div className="project-details-modal__detail-item">
                <span className="project-details-modal__label">Client Name</span>
                <span className="project-details-modal__value">{project.client}</span>
              </div>
              <div className="project-details-modal__detail-item">
                <span className="project-details-modal__label">Client Email</span>
                <span className="project-details-modal__value">
                  {project.clientEmail ? (
                    <a href={`mailto:${project.clientEmail}`} className="project-details-modal__link">
                      {project.clientEmail}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="project-details-modal__section">
            <h3 className="project-details-modal__section-title">
              <DollarSign size={16} /> Financial Breakdown
            </h3>
            <div className="project-details-modal__grid project-details-modal__grid--three">
              <div className="project-details-modal__detail-item">
                <span className="project-details-modal__label">Total Budget</span>
                <span className="project-details-modal__value project-details-modal__value--budget">
                  {formatCurrency(totalBudget)}
                </span>
              </div>
              <div className="project-details-modal__detail-item">
                <span className="project-details-modal__label">Advance Paid</span>
                <span className="project-details-modal__value">{advanceDetail}</span>
              </div>
              <div className="project-details-modal__detail-item">
                <span className="project-details-modal__label">Outstanding Balance</span>
                <span className="project-details-modal__value project-details-modal__value--balance">
                  {formatCurrency(remainingBalance)}
                </span>
              </div>
            </div>
          </div>

          <div className="project-details-modal__section">
            <h3 className="project-details-modal__section-title">
              <Calendar size={16} /> Timeline & Progress
            </h3>
            <div className="project-details-modal__grid">
              <div className="project-details-modal__detail-item">
                <span className="project-details-modal__label">Due Date</span>
                <span className="project-details-modal__value">{formatDate(project.dueDate)}</span>
              </div>
              <div className="project-details-modal__detail-item project-details-modal__detail-item--progress">
                <div className="project-details-modal__progress-info">
                  <span className="project-details-modal__label">Completion Progress</span>
                  <span className="project-details-modal__value">{isProjectDone ? "100%" : `${project.progress || 0}%`}</span>
                </div>
                <div className="project-details-modal__progress-track">
                  <div
                    className="project-details-modal__progress-bar"
                    style={{ width: isProjectDone ? "100%" : `${project.progress || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {project.id && (
            <div className="project-details-modal__metadata">
              <span>Project ID: {project.id}</span>
              {project.createdAt && <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>}
            </div>
          )}
        </section>

        <footer className="project-details-modal__footer">
          <button
            type="button"
            className="project-details-modal__action-btn project-details-modal__action-btn--secondary"
            onClick={handleMarkCompleted}
            disabled={isProjectDone}
          >
            <CheckCircle2 size={16} />
            {isProjectDone ? "Project Completed" : "Mark as Completed"}
          </button>
          <button
            type="button"
            className="project-details-modal__action-btn project-details-modal__action-btn--primary"
            onClick={handlePaymentCompleted}
            disabled={isPaymentPaid}
          >
            <DollarSign size={16} />
            {isPaymentPaid ? "Payment Completed" : "Payment Completed"}
          </button>
        </footer>
      </article>
    </div>
  );
}
