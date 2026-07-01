/**
 * ReminderService.js
 *
 * Runs on the frontend side. After a user logs in it:
 *  1. Reads all known projects from the project data store.
 *  2. POSTs them — together with the freelancer's email — to the Go backend.
 *  3. The backend evaluates which projects are due in 1 / 3 / 5 days and
 *     sends the appropriate HTML reminder emails automatically.
 *
 * "Register" is called once per login session and persists the data in the
 * backend's in-memory scheduler so the daily cron picks it up every 24 h.
 */

const BACKEND_BASE = "http://localhost:8080";
const REMINDER_REGISTER_URL = `${BACKEND_BASE}/api/reminders/register`;
const STORAGE_KEY = "solosync-reminder-last-registered";

/**
 * The canonical list of projects known to SoloSync.
 * In a future database-backed release, this would be fetched from an API.
 */
export const ALL_PROJECTS = [
  {
    id: "proj-1",
    name: "Acme Website Redesign",
    client: "Acme Corp",
    dueDate: "2026-07-15",
  },
  {
    id: "proj-2",
    name: "Mobile App API Integration",
    client: "Stark Industries",
    dueDate: "2026-07-30",
  },
  {
    id: "proj-3",
    name: "Brand Identity & Guidelines",
    client: "Wayne Enterprises",
    dueDate: "2026-06-28",
  },
];

/**
 * Registers all current projects with the backend reminder scheduler.
 * Safe to call repeatedly — the backend deduplicates by email.
 *
 * @param {string} freelancerEmail - The email address the user logged in with.
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function registerReminders(freelancerEmail) {
  if (!freelancerEmail) {
    console.warn("[ReminderService] No freelancer email supplied — skipping registration.");
    return { success: false, message: "No email supplied." };
  }

  const payload = {
    freelancerEmail,
    projects: ALL_PROJECTS.map((p) => ({
      name: p.name,
      client: p.client,
      dueDate: p.dueDate,  // backend expects "YYYY-MM-DD"
    })),
  };

  try {
    const res = await fetch(REMINDER_REGISTER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      // Stamp the last registration time so callers can avoid duplicate calls
      sessionStorage.setItem(STORAGE_KEY, new Date().toISOString());
      console.log("[ReminderService] ✅ Reminders registered:", data.message);
    } else {
      console.warn("[ReminderService] ⚠️ Backend response:", data.message);
    }

    return data;
  } catch (err) {
    // Backend might not be running in dev — log gracefully without crashing.
    console.error("[ReminderService] ❌ Could not reach backend:", err.message);
    return { success: false, message: err.message };
  }
}

/**
 * Returns true if reminders have already been registered this browser session.
 */
export function alreadyRegisteredThisSession() {
  return !!sessionStorage.getItem(STORAGE_KEY);
}
