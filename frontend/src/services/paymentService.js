export const PAYMENT_STORAGE_KEY = "solosync-payment-projects";
export const PAYMENT_UPDATED_EVENT = "solosync-payments-updated";

const DEFAULT_PAYMENT_PROJECTS = [
  {
    id: "proj-1",
    name: "Acme Website Redesign",
    client: "Acme Corp",
    totalAmount: 4500,
    advancePaid: 1500,
    advancePaidAt: "2026-06-03",
    isCompleted: false,
    paymentReceived: false,
    paymentReceivedAt: null,
  },
  {
    id: "proj-2",
    name: "Mobile App API Integration",
    client: "Stark Industries",
    totalAmount: 6200,
    advancePaid: 2200,
    advancePaidAt: "2026-06-12",
    isCompleted: false,
    paymentReceived: false,
    paymentReceivedAt: null,
  },
  {
    id: "proj-3",
    name: "Brand Identity & Guidelines",
    client: "Wayne Enterprises",
    totalAmount: 2800,
    advancePaid: 1000,
    advancePaidAt: "2026-05-20",
    isCompleted: true,
    paymentReceived: true,
    paymentReceivedAt: "2026-06-24",
  },
];

function toAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

function isDateInCurrentMonth(dateValue, now = new Date()) {
  if (!dateValue) {
    return false;
  }

  const date = new Date(`${dateValue}T00:00`);
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export function getPaymentProjects() {
  if (typeof window === "undefined") {
    return DEFAULT_PAYMENT_PROJECTS;
  }

  try {
    const stored = localStorage.getItem(PAYMENT_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(DEFAULT_PAYMENT_PROJECTS));
      return DEFAULT_PAYMENT_PROJECTS;
    }

    const projects = JSON.parse(stored);
    return Array.isArray(projects) ? projects : [];
  } catch (error) {
    console.error("Could not load payment projects:", error);
    return [];
  }
}

export function savePaymentProjects(projects) {
  localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(projects));
  window.dispatchEvent(new CustomEvent(PAYMENT_UPDATED_EVENT));
}

export function markPaymentCompleted(projectId) {
  const projects = getPaymentProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index !== -1) {
    if (projects[index].paymentReceived) {
      return;
    }
    projects[index].paymentReceived = true;
    projects[index].paymentReceivedAt = new Date().toISOString().split("T")[0];
    savePaymentProjects(projects);
  }
}

export function calculatePaymentSummary(projects, now = new Date()) {
  return projects.reduce(
    (summary, project) => {
      const totalAmount = toAmount(project.totalAmount);
      const advancePaid = toAmount(project.advancePaid);
      const remainingBalance = Math.max(totalAmount - advancePaid, 0);

      if (!project.paymentReceived) {
        summary.pendingPayments += remainingBalance;
      }

      if (project.isCompleted && project.paymentReceived) {
        summary.completedPayments += totalAmount;
      }

      if (advancePaid > 0 && isDateInCurrentMonth(project.advancePaidAt, now)) {
        summary.currentMonthIncome += advancePaid;
      }

      if (project.paymentReceived && isDateInCurrentMonth(project.paymentReceivedAt, now)) {
        summary.currentMonthIncome += remainingBalance;
      }

      return summary;
    },
    {
      currentMonthIncome: 0,
      pendingPayments: 0,
      completedPayments: 0,
    }
  );
}

