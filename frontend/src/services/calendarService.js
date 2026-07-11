const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function buildURL(path) {
  return `${API_BASE_URL}${path}`;
}

export function connectGoogleCalendar(userEmail) {
  if (!userEmail) {
    throw new Error("User email is required.");
  }

  window.location.href = buildURL(`/auth/google?userEmail=${encodeURIComponent(userEmail)}`);
}

export async function getGoogleCalendarStatus(userEmail) {
  if (!userEmail) {
    return { connected: false };
  }

  const response = await fetch(buildURL(`/calendar/status?userEmail=${encodeURIComponent(userEmail)}`));
  if (!response.ok) {
    throw new Error("Could not load Google Calendar status.");
  }

  return response.json();
}

export async function createGoogleCalendarEvent(meeting, userEmail) {
  if (!userEmail) {
    throw new Error("Connect a SoloSync profile before adding calendar events.");
  }

  const start = new Date(`${meeting.date}T${meeting.time || "00:00"}`);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const response = await fetch(buildURL("/calendar/create-event"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userEmail,
      summary: `${meeting.projectName} Meeting`,
      description: "Scheduled from SoloSync",
      start: start.toISOString(),
      end: end.toISOString(),
      timeZone,
      reminderMinutes: 10,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Could not create Google Calendar event.");
  }

  return data.event;
}
