import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import "./NewProjectModal.css";

const initialForm = {
  projectName: "",
  clientName: "",
  clientEmail: "",
  totalBudget: "",
  dueDate: "",
  requestAdvance: false,
  advanceType: "percentage",
  advanceValue: "",
};

function todayValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export default function NewProjectModal({ isOpen, onClose, onCreate }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const budget = Number(form.totalBudget) || 0;
  const advanceValue = Number(form.advanceValue) || 0;
  const advanceAmount = useMemo(() => {
    if (!form.requestAdvance) {
      return 0;
    }

    return form.advanceType === "percentage"
      ? (budget * advanceValue) / 100
      : advanceValue;
  }, [advanceValue, budget, form.advanceType, form.requestAdvance]);

  useEffect(() => {
    if (!isOpen) {
      setForm(initialForm);
      setErrors({});
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    const dueDate = form.dueDate ? new Date(`${form.dueDate}T00:00:00`) : null;
    const today = new Date(`${todayValue()}T00:00:00`);

    if (!form.projectName.trim()) {
      nextErrors.projectName = "Project name is required.";
    }
    if (!form.clientName.trim()) {
      nextErrors.clientName = "Client name is required.";
    }
    if (!form.clientEmail.trim()) {
      nextErrors.clientEmail = "Client email is required.";
    } else if (!isValidEmail(form.clientEmail.trim())) {
      nextErrors.clientEmail = "Enter a valid email address.";
    }
    if (budget <= 0) {
      nextErrors.totalBudget = "Budget must be greater than $0.";
    }
    if (!form.dueDate) {
      nextErrors.dueDate = "Due date is required.";
    } else if (dueDate < today) {
      nextErrors.dueDate = "Due date cannot be in the past.";
    }
    if (form.requestAdvance) {
      if (advanceValue <= 0) {
        nextErrors.advanceValue = "Enter an advance value greater than 0.";
      } else if (form.advanceType === "percentage" && advanceValue > 100) {
        nextErrors.advanceValue = "Percentage cannot exceed 100%.";
      } else if (advanceAmount > budget) {
        nextErrors.advanceValue = "Advance cannot exceed total budget.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onCreate({
      name: form.projectName.trim(),
      client: form.clientName.trim(),
      clientEmail: form.clientEmail.trim(),
      totalBudget: budget,
      dueDate: form.dueDate,
      advance: form.requestAdvance
        ? {
            requested: true,
            type: form.advanceType,
            value: advanceValue,
            amount: advanceAmount,
          }
        : {
            requested: false,
            type: null,
            value: 0,
            amount: 0,
          },
    });
  };

  return (
    <div className="new-project-modal" role="dialog" aria-modal="true" aria-labelledby="new-project-title">
      <button type="button" className="new-project-modal__backdrop" onClick={onClose} aria-label="Close modal" />

      <form className="new-project-modal__panel" onSubmit={handleSubmit} noValidate>
        <header className="new-project-modal__header">
          <div>
            <h2 id="new-project-title">Create New Project</h2>
            <p>Add a client project and optional advance payment request.</p>
          </div>
          <button type="button" className="new-project-modal__icon-button" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </header>

        <div className="new-project-modal__grid">
          <label className="new-project-modal__field">
            <span>Project Name</span>
            <input
              value={form.projectName}
              onChange={(event) => setField("projectName", event.target.value)}
              placeholder="Website redesign"
            />
            {errors.projectName && <small>{errors.projectName}</small>}
          </label>

          <label className="new-project-modal__field">
            <span>Client Name</span>
            <input
              value={form.clientName}
              onChange={(event) => setField("clientName", event.target.value)}
              placeholder="Acme Corp"
            />
            {errors.clientName && <small>{errors.clientName}</small>}
          </label>

          <label className="new-project-modal__field">
            <span>Client Email</span>
            <input
              type="email"
              value={form.clientEmail}
              onChange={(event) => setField("clientEmail", event.target.value)}
              placeholder="client@example.com"
            />
            {errors.clientEmail && <small>{errors.clientEmail}</small>}
          </label>

          <label className="new-project-modal__field">
            <span>Total Budget ($)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.totalBudget}
              onChange={(event) => setField("totalBudget", event.target.value)}
              placeholder="5000"
            />
            {errors.totalBudget && <small>{errors.totalBudget}</small>}
          </label>

          <label className="new-project-modal__field">
            <span>Due Date</span>
            <input
              type="date"
              min={todayValue()}
              value={form.dueDate}
              onChange={(event) => setField("dueDate", event.target.value)}
            />
            {errors.dueDate && <small>{errors.dueDate}</small>}
          </label>
        </div>

        <label className="new-project-modal__checkbox">
          <input
            type="checkbox"
            checked={form.requestAdvance}
            onChange={(event) => setField("requestAdvance", event.target.checked)}
          />
          <span>Request Advance Payment</span>
        </label>

        {form.requestAdvance && (
          <section className="new-project-modal__advance">
            <div className="new-project-modal__segmented" aria-label="Advance type">
              <button
                type="button"
                className={form.advanceType === "percentage" ? "is-active" : ""}
                onClick={() => setField("advanceType", "percentage")}
              >
                Percentage %
              </button>
              <button
                type="button"
                className={form.advanceType === "fixed" ? "is-active" : ""}
                onClick={() => setField("advanceType", "fixed")}
              >
                Fixed Amount $
              </button>
            </div>

            <label className="new-project-modal__field">
              <span>Value</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.advanceValue}
                onChange={(event) => setField("advanceValue", event.target.value)}
                placeholder={form.advanceType === "percentage" ? "30" : "1500"}
              />
              {errors.advanceValue && <small>{errors.advanceValue}</small>}
            </label>

            <div className="new-project-modal__calculation">
              <CheckCircle2 size={18} />
              <span>Calculated advance</span>
              <strong>{currency(advanceAmount)}</strong>
            </div>
          </section>
        )}

        <footer className="new-project-modal__actions">
          <button type="button" className="new-project-modal__button new-project-modal__button--secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="new-project-modal__button new-project-modal__button--primary">
            Create Project
          </button>
        </footer>
      </form>
    </div>
  );
}
