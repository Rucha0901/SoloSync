/**
 * googleCalendarService.js
 * ─────────────────────────────────────────────────────────────
 * Handles all Google Calendar API interactions for SoloSync.
 * Uses Google Identity Services (GIS) for OAuth 2.0 + gapi for API calls.
 *
 * Storage keys:
 *   gcal_access_token   – current OAuth access token
 *   gcal_token_expiry   – token expiry timestamp (ms)
 *   gcal_event_map      – JSON object { meetingId: googleEventId }
 * ─────────────────────────────────────────────────────────────
 */

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = "https://www.googleapis.com/auth/calendar.events";
const CALENDAR_ID = "primary";
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

// ─── Storage helpers ──────────────────────────────────────────

function storeToken(token) {
  localStorage.setItem("gcal_access_token", token.access_token);
  // GIS tokens expire in 3600 seconds; store expiry with a 60-second buffer
  const expiry = Date.now() + (token.expires_in - 60) * 1000;
  localStorage.setItem("gcal_token_expiry", String(expiry));
}

function clearToken() {
  localStorage.removeItem("gcal_access_token");
  localStorage.removeItem("gcal_token_expiry");
}

function getStoredToken() {
  const token = localStorage.getItem("gcal_access_token");
  const expiry = Number(localStorage.getItem("gcal_token_expiry") || "0");
  if (!token || Date.now() >= expiry) return null;
  return token;
}

function getEventMap() {
  try {
    return JSON.parse(localStorage.getItem("gcal_event_map") || "{}");
  } catch {
    return {};
  }
}

function saveEventMap(map) {
  localStorage.setItem("gcal_event_map", JSON.stringify(map));
}

// ─── Script loaders ──────────────────────────────────────────

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

let gapiReady = false;
let gisReady = false;

async function ensureGapiReady() {
  if (gapiReady) return;
  await loadScript("https://apis.google.com/js/api.js");
  await new Promise((resolve) => window.gapi.load("client", resolve));
  await window.gapi.client.init({ discoveryDocs: [DISCOVERY_DOC] });
  gapiReady = true;
}

async function ensureGisReady() {
  if (gisReady) return;
  await loadScript("https://accounts.google.com/gsi/client");
  gisReady = true;
}

// ─── Public API ───────────────────────────────────────────────

/** Returns true if we have a valid (non-expired) access token. */
export function isGoogleCalendarConnected() {
  return !!getStoredToken();
}

/**
 * Opens the Google OAuth 2.0 popup and requests calendar.events scope.
 * Returns the access token on success.
 */
export async function connectGoogleCalendar() {
  if (!CLIENT_ID || CLIENT_ID === "your-google-oauth-client-id-here") {
    throw new Error(
      "VITE_GOOGLE_CLIENT_ID is not set. Please add your Google OAuth Client ID to frontend/.env"
    );
  }

  await ensureGisReady();
  await ensureGapiReady();

  return new Promise((resolve, reject) => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (response) => {
        if (response.error) {
          reject(new Error(response.error));
          return;
        }
        storeToken(response);
        // Set token on gapi client so subsequent API calls are authenticated
        window.gapi.client.setToken({ access_token: response.access_token });
        resolve(response.access_token);
      },
    });
    tokenClient.requestAccessToken({ prompt: "consent" });
  });
}

/** Revokes the stored token and clears all GCal state. */
export async function disconnectGoogleCalendar() {
  const token = getStoredToken();
  if (token) {
    await ensureGisReady();
    window.google.accounts.oauth2.revoke(token, () => {});
  }
  clearToken();
  // Keep the event map so we don't duplicate if reconnected, but clear it too
  localStorage.removeItem("gcal_event_map");
}

/**
 * Applies a stored token to the gapi client (called on page load if connected).
 */
export async function restoreGapiToken() {
  const token = getStoredToken();
  if (!token) return false;
  await ensureGapiReady();
  window.gapi.client.setToken({ access_token: token });
  return true;
}

/**
 * Creates a Google Calendar event from a SoloSync meeting object.
 * @param {Object} meeting - { id, projectName, date, time, meetLink? }
 * @returns {string|null} The Google Event ID, or null on failure.
 */
export async function syncMeetingToCalendar(meeting) {
  const token = getStoredToken();
  if (!token) return null;

  try {
    await ensureGapiReady();
    window.gapi.client.setToken({ access_token: token });

    // Build start/end datetime (45-minute default duration)
    const [year, month, day] = meeting.date.split("-").map(Number);
    const [hour, minute] = (meeting.time || "00:00").split(":").map(Number);

    const startDT = new Date(year, month - 1, day, hour, minute);
    const endDT = new Date(startDT.getTime() + 45 * 60 * 1000);

    function toRFC3339Local(date) {
      const pad = (n) => String(n).padStart(2, "0");
      return (
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
        `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
      );
    }

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const event = {
      summary: `Meet: ${meeting.projectName}`,
      description: `Client meeting scheduled via SoloSync.\n\nProject: ${meeting.projectName}${meeting.meetLink ? `\n\nJoin: ${meeting.meetLink}` : ""}`,
      start: { dateTime: toRFC3339Local(startDT), timeZone: tz },
      end: { dateTime: toRFC3339Local(endDT), timeZone: tz },
      colorId: "7", // Peacock (teal) to match SoloSync branding
      ...(meeting.meetLink
        ? { location: meeting.meetLink }
        : {}),
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 15 },
          { method: "email", minutes: 60 },
        ],
      },
    };

    const response = await window.gapi.client.calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: event,
    });

    const googleEventId = response.result.id;

    // Store the mapping meetingId → googleEventId
    const map = getEventMap();
    map[meeting.id] = googleEventId;
    saveEventMap(map);

    return googleEventId;
  } catch (err) {
    console.error("Failed to sync meeting to Google Calendar:", err);
    return null;
  }
}

/**
 * Deletes a Google Calendar event linked to a SoloSync meeting ID.
 * @param {string} meetingId
 */
export async function deleteMeetingFromCalendar(meetingId) {
  const token = getStoredToken();
  if (!token) return;

  const map = getEventMap();
  const googleEventId = map[meetingId];
  if (!googleEventId) return;

  try {
    await ensureGapiReady();
    window.gapi.client.setToken({ access_token: token });

    await window.gapi.client.calendar.events.delete({
      calendarId: CALENDAR_ID,
      eventId: googleEventId,
    });

    delete map[meetingId];
    saveEventMap(map);
  } catch (err) {
    // 410 Gone means it was already deleted — safe to ignore
    if (err?.status !== 410) {
      console.error("Failed to delete meeting from Google Calendar:", err);
    }
    delete map[meetingId];
    saveEventMap(map);
  }
}

/**
 * Syncs all provided meetings to Google Calendar (used on first connect).
 * @param {Array} meetings
 */
export async function syncAllMeetingsToCalendar(meetings) {
  for (const meeting of meetings) {
    // Skip if already synced
    const map = getEventMap();
    if (map[meeting.id]) continue;
    await syncMeetingToCalendar(meeting);
  }
}
