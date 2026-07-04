import { getPaymentProjects, savePaymentProjects } from "./paymentService";

export const SCHEDULE_STORAGE_KEY = "solosync-meet-schedules";
export const SCHEDULE_UPDATED_EVENT = "solosync-schedules-updated";
export const PROJECTS_STORAGE_KEY = "solosync-active-projects";
export const PROJECTS_UPDATED_EVENT = "solosync-projects-updated";

export const ACTIVE_PROJECTS = [
  {
    id: "proj-1",
    name: "Acme Website Redesign",
    client: "Acme Corp",
    status: "In Progress",
    statusType: "progress",
    budget: "$4,500",
    progress: 65,
    dueDate: "2026-07-15",
  },
  {
    id: "proj-2",
    name: "Mobile App API Integration",
    client: "Stark Industries",
    status: "In Progress",
    statusType: "progress",
    budget: "$6,200",
    progress: 40,
    dueDate: "2026-07-30",
  },
  {
    id: "proj-3",
    name: "Brand Identity & Guidelines",
    client: "Wayne Enterprises",
    status: "In Review",
    statusType: "review",
    budget: "$2,800",
    progress: 95,
    dueDate: "2026-06-28",
  },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function seededProjects() {
  return ACTIVE_PROJECTS.map((project) => ({ ...project }));
}

export function getProjects() {
  if (typeof window === "undefined") {
    return seededProjects();
  }

  try {
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!stored) {
      const seeded = seededProjects();
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Could not load projects:", error);
    return seededProjects();
  }
}

export function saveProjects(projects) {
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  window.dispatchEvent(new CustomEvent(PROJECTS_UPDATED_EVENT));
}

export function addProject(project) {
  const projects = getProjects();
  const nextProject = {
    id: crypto.randomUUID ? crypto.randomUUID() : `proj-${Date.now()}`,
    name: project.name,
    client: project.client,
    clientEmail: project.clientEmail,
    status: "In Progress",
    statusType: "progress",
    budget: formatCurrency(project.totalBudget),
    totalBudget: project.totalBudget,
    progress: 0,
    dueDate: project.dueDate,
    advance: project.advance,
    createdAt: new Date().toISOString(),
  };
  const nextProjects = [nextProject, ...projects];
  saveProjects(nextProjects);

  try {
    const paymentProjects = getPaymentProjects();
    const hasAdvance = project.advance?.requested;
    const advancePaidAmt = hasAdvance ? Number(project.advance.amount) || 0 : 0;
    paymentProjects.push({
      id: nextProject.id,
      name: nextProject.name,
      client: nextProject.client,
      totalAmount: Number(nextProject.totalBudget) || 0,
      advancePaid: advancePaidAmt,
      advancePaidAt: hasAdvance ? new Date().toISOString().split("T")[0] : null,
      isCompleted: false,
      paymentReceived: false,
      paymentReceivedAt: null,
    });
    savePaymentProjects(paymentProjects);
  } catch (err) {
    console.error("Could not sync added project to payment service:", err);
  }

  return nextProject;
}

export function markProjectCompleted(projectId) {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index !== -1) {
    if (projects[index].status === "Completed") {
      return;
    }
    projects[index].status = "Completed";
    projects[index].statusType = "completed";
    projects[index].progress = 100;
    projects[index].completedDate = new Date().toISOString().split("T")[0];
    saveProjects(projects);
  }

  try {
    const paymentProjects = getPaymentProjects();
    const payIndex = paymentProjects.findIndex((p) => p.id === projectId);
    if (payIndex !== -1) {
      if (!paymentProjects[payIndex].isCompleted) {
        paymentProjects[payIndex].isCompleted = true;
        savePaymentProjects(paymentProjects);
      }
    } else {
      const proj = projects[index];
      if (proj) {
        const total = proj.totalBudget || (proj.budget ? Number(proj.budget.replace(/[^0-9]/g, "")) : 0);
        const advanceAmt = proj.advance?.amount || 0;
        paymentProjects.push({
          id: projectId,
          name: proj.name,
          client: proj.client,
          totalAmount: total,
          advancePaid: advanceAmt,
          advancePaidAt: proj.advance?.requested ? new Date().toISOString().split("T")[0] : null,
          isCompleted: true,
          paymentReceived: false,
          paymentReceivedAt: null,
        });
        savePaymentProjects(paymentProjects);
      }
    }
  } catch (err) {
    console.error("Could not sync project completion to payment service:", err);
  }
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function defaultMeetings() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const reviewDay = new Date();
  reviewDay.setDate(reviewDay.getDate() + 5);

  return [
    {
      id: "meet-1",
      projectName: "Acme Website Redesign",
      date: toDateInputValue(tomorrow),
      time: "10:30",
    },
    {
      id: "meet-2",
      projectName: "Mobile App API Integration",
      date: toDateInputValue(reviewDay),
      time: "15:00",
    },
  ];
}

export function getMeetings() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (!stored) {
      const seeded = defaultMeetings();
      localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Could not load meet schedules:", error);
    return defaultMeetings();
  }
}

export function saveMeetings(meetings) {
  localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(meetings));
  window.dispatchEvent(new CustomEvent(SCHEDULE_UPDATED_EVENT));
}

export function addMeeting(meeting) {
  const meetings = getMeetings();
  const nextMeetings = [
    ...meetings,
    {
      id: crypto.randomUUID ? crypto.randomUUID() : `meet-${Date.now()}`,
      ...meeting,
    },
  ];
  saveMeetings(nextMeetings);
  return nextMeetings;
}

export function getMeetingDateTime(meeting) {
  return new Date(`${meeting.date}T${meeting.time || "00:00"}`);
}

export function getUpcomingMeetings(meetings = getMeetings()) {
  const now = new Date();
  return meetings
    .filter((meeting) => getMeetingDateTime(meeting) >= now)
    .sort((a, b) => getMeetingDateTime(a) - getMeetingDateTime(b));
}

export function formatMeetingTime(meeting) {
  return getMeetingDateTime(meeting).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDateLabel(date) {
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getMonthCells(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const cells = [];

  for (let i = 0; i < firstDay; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  return cells;
}

export function isSameDate(value, date) {
  return value === toDateInputValue(date);
}
