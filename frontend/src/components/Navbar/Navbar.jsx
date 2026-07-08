import { useState, useRef, useEffect } from "react";
import { CalendarClock, CalendarDays, ClipboardList, Clock, Plus, Timer, Video, X } from "lucide-react";
import Logo from "../Logo/Logo";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../Avatars/Avatars";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import {
  SCHEDULE_UPDATED_EVENT,
  addMeeting,
  formatDateLabel,
  formatMeetingTime,
  getMeetingDateTime,
  getMeetings,
  getUpcomingMeetings,
} from "../../services/scheduleService";
import {
  createGoogleCalendarEvent,
  getGoogleCalendarStatus,
} from "../../services/calendarService";
import "./Navbar.css";

export default function Navbar({ onMenuClick, searchQuery = "", onSearchChange, onNewProjectClick }) {
  const { user } = useAuth();
  const [isAIPopoverOpen, setIsAIPopoverOpen] = useState(false);
  const [isMeetModalOpen, setIsMeetModalOpen] = useState(false);
  const [meetings, setMeetings] = useState(() => getMeetings());
  const [now, setNow] = useState(() => new Date());
  const [meetForm, setMeetForm] = useState({
    projectName: "",
    date: "",
    time: "",
    addToGoogleCalendar: false,
  });
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [meetError, setMeetError] = useState("");
  const [isCreatingMeet, setIsCreatingMeet] = useState(false);
  const popoverRef = useRef(null);
  const searchInputRef = useRef(null);

  const upcomingMeeting = getUpcomingMeetings(meetings)[0];

  // Focus search input when "/" is pressed
  useEffect(() => {
    function handleKeyDown(e) {
      if (
        e.key === "/" &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isMeetModalOpen || !user?.email) {
      return undefined;
    }

    let isMounted = true;
    getGoogleCalendarStatus(user.email)
      .then((status) => {
        if (isMounted) {
          setCalendarConnected(Boolean(status.connected));
        }
      })
      .catch(() => {
        if (isMounted) {
          setCalendarConnected(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isMeetModalOpen, user?.email]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    function refreshMeetings() {
      setMeetings(getMeetings());
    }

    window.addEventListener(SCHEDULE_UPDATED_EVENT, refreshMeetings);
    window.addEventListener("storage", refreshMeetings);
    return () => {
      window.removeEventListener(SCHEDULE_UPDATED_EVENT, refreshMeetings);
      window.removeEventListener("storage", refreshMeetings);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsAIPopoverOpen(false);
      }
    }

    if (isAIPopoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAIPopoverOpen]);

  const formatCountdown = (meeting) => {
    if (!meeting) {
      return "No meets scheduled";
    }

    const remainingMs = getMeetingDateTime(meeting) - now;
    if (remainingMs <= 0) {
      return "Starting now";
    }

    const totalMinutes = Math.floor(remainingMs / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleMeetFormChange = (event) => {
    const { name, type, checked, value } = event.target;
    setMeetForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setMeetError("");
  };

  const handleAddMeet = async (event) => {
    event.preventDefault();
    if (!meetForm.projectName.trim() || !meetForm.date || !meetForm.time) {
      return;
    }
    if (meetForm.addToGoogleCalendar && !calendarConnected) {
      setMeetError("Connect Google Calendar from Profile before adding events.");
      return;
    }

    setIsCreatingMeet(true);

    const meeting = {
      projectName: meetForm.projectName.trim(),
      date: meetForm.date,
      time: meetForm.time,
    };

    try {
      const nextMeetings = addMeeting(meeting);
      setMeetings(nextMeetings);

      if (meetForm.addToGoogleCalendar) {
        await createGoogleCalendarEvent(meeting, user.email);
      }

      setMeetForm({ projectName: "", date: "", time: "", addToGoogleCalendar: false });
      setMeetError("");
      setIsMeetModalOpen(false);
    } catch (error) {
      setMeetError(error.message || "Could not add this meeting to Google Calendar.");
    } finally {
      setIsCreatingMeet(false);
    }
  };

  const aiTools = [
    {
      name: "Antigravity",
      url: "https://deepmind.google",
      color: "#6366f1",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" fill="currentColor" fillOpacity="0.2" />
          <path d="M5 16c2 1.5 5 2.5 7 2.5s5-1 7-2.5" />
          <path d="M3 20c3 2 6 3 9 3s6-1 9-3" />
          <path d="M12 12v3" />
          <path d="M10 14l2-2 2 2" />
        </svg>
      )
    },
    {
      name: "Claude",
      url: "https://claude.ai",
      color: "#d08960",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M12 2a1.5 1.5 0 011.5 1.5v3.66a5.5 5.5 0 013.9 1.61l2.59-2.59a1.5 1.5 0 112.12 2.12l-2.59 2.59a5.5 5.5 0 011.61 3.9h3.66a1.5 1.5 0 110 3h-3.66a5.5 5.5 0 01-1.61 3.9l2.59 2.59a1.5 1.5 0 11-2.12 2.12l-2.59-2.59a5.5 5.5 0 01-3.9 1.61v3.66a1.5 1.5 0 11-3 0v-3.66a5.5 5.5 0 01-3.9-1.61l-2.59 2.59a1.5 1.5 0 11-2.12-2.12l-2.59-2.59a5.5 5.5 0 01-5.68-1.74h-3.66a1.5 1.5 0 110-3h3.66a5.5 5.5 0 011.61-3.9L4.7 5.5a1.5 1.5 0 112.12-2.12l2.59 2.59A5.5 5.5 0 0110.5 7.16V3.5A1.5 1.5 0 0112 2z"/>
        </svg>
      )
    },
    {
      name: "ChatGPT",
      url: "https://chatgpt.com",
      color: "#10a37f",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M21.2 11.2c-.3-1.6-1.5-2.7-3-2.9v-.3c0-1.7-1.1-3-2.8-3.4-.6-.7-1.5-1.1-2.4-1.1-1.3 0-2.5.8-3 2a3.3 3.3 0 00-3.3 1.8 3.3 3.3 0 00-2 4.1c-1 .6-1.6 1.7-1.6 2.9 0 1.6 1.1 2.9 2.7 3.2v.3c0 1.7 1.1 3 2.8 3.4-.6.7-1.5 1.1-2.4 1.1-1.3 0-2.5-.8-3-2a3.3 3.3 0 003.3-1.8 3.3 3.3 0 002-4.1c1-.6 1.6-1.7 1.6-2.9 0-.2 0-.4-.1-.6zm-8.8-6.1c.5 0 1 .2 1.3.6-.4.2-.8.5-1 .9L10 8.3c-.3-.2-.5-.5-.5-.9 0-1 1-1.8 2.2-1.8zM7.4 9.1c.3-.2.6-.3.9-.3v3.4L6.1 14c-.3-.4-.5-.9-.5-1.4 0-1 .8-1.8 1.8-1.8zm-.6 5.6c0-.3.1-.6.3-.9l3 1.7-2.2 2.7c-.5-.3-.8-.8-.8-1.4 0-.8.6-1.4 1.2-1.4zm6.4 3.9c-.5 0-1-.2-1.3-.6.4-.2.8-.5 1-.9l2.7-1.7c.3.2.5.5.5.9 0 1-1 1.8-2.2 1.8zm3.4-2.8c-.3.2-.6.3-.9.3v-3.4l2.2-1.3c.3.4.5.9.5 1.4 0 1-.8 1.8-1.8 1.8zm.6-5.6c0 .3-.1.6-.3.9l-3-1.7 2.2-2.7c.5.3.8.8.8 1.4 0 .8-.6 1.4-1.2 1.4z"/>
        </svg>
      )
    },
    {
      name: "Gemini",
      url: "https://gemini.google.com",
      color: "#1a73e8",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M12 3c.1 4.4 1.5 6.9 4.9 8.1-3.4 1.2-4.8 3.7-4.9 8.1-.1-4.4-1.5-6.9-4.9-8.1 3.4-1.2 4.8-3.7 4.9-8.1zM19 16c0 1.9.6 3 2.1 3.5-1.5.5-2.1 1.6-2.1 3.5 0-1.9-.6-3-2.1-3.5 1.5-.5 2.1-1.6 2.1-3.5z"/>
        </svg>
      )
    }
  ];

  return (
    <header className="navbar">
      <button
        type="button"
        className="navbar__menu-button"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className="navbar__brand-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Logo size={28} />
        <span className="navbar__brand">
          Solo<span className="navbar__brand-accent">Sync</span>
        </span>
      </div>

      <div className="navbar__spacer" />

      <div className="navbar__search-container">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="navbar__search-icon"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={searchInputRef}
          type="text"
          className="navbar__search-input"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search projects by name"
        />
        {searchQuery && (
          <button
            type="button"
            className="navbar__search-clear"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        <span className="navbar__search-shortcut">/</span>
      </div>

      <div className="navbar__schedule-actions">
        <button
          type="button"
          className="navbar__schedule-button navbar__schedule-button--primary"
          onClick={() => setIsMeetModalOpen(true)}
          aria-label="Add new meet in schedule"
          title="Add new meet"
        >
          <Plus size={16} />
          <span>Add Meet</span>
        </button>

        <Link
          to="/dashboard/meet-schedule"
          className="navbar__schedule-button"
          aria-label="Open meet scheduling"
          title="Meet scheduling"
        >
          <CalendarClock size={16} />
          <span>Meet Schedule</span>
        </Link>

        <Link
          to="/dashboard/deadline-schedule"
          className="navbar__schedule-button"
          aria-label="Open deadline scheduling"
          title="Deadline scheduling"
        >
          <ClipboardList size={16} />
          <span>Deadlines</span>
        </Link>
      </div>

      <button
        type="button"
        className="navbar__new-project-button"
        onClick={onNewProjectClick}
        aria-label="Create new project"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="navbar__new-project-button-icon"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span className="navbar__new-project-button-text">New Project</span>
      </button>

      <div className="navbar__ai-container" ref={popoverRef}>
        <button
          type="button"
          className={`navbar__ai-button ${isAIPopoverOpen ? "navbar__ai-button--active" : ""}`}
          onClick={() => setIsAIPopoverOpen(!isAIPopoverOpen)}
          aria-label="AI Tools"
          aria-expanded={isAIPopoverOpen}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="navbar__ai-button-icon"
          >
            <path d="M12 3c.132 4.394 1.513 5.775 5.908 5.908-4.395.132-5.776 1.513-5.908 5.908-.132-4.395-1.513-5.776-5.908-5.908 4.394-.132 5.775-1.513 5.908-5.908z" />
            <path d="M18 15c.066 2.197.757 2.888 2.954 2.954-2.197.066-2.888.757-2.954 2.954-.066-2.197-.757-2.888-2.954-2.954 2.197-.066 2.888-.757 2.954-2.954z" />
            <path d="M7.5 4c.033 1.098.378 1.444 1.477 1.477-1.099.033-1.444.378-1.477 1.477-.033-1.099-.378-1.444-1.477-1.477 1.098-.033 1.444-.378 1.477-1.477z" />
          </svg>
          <span className="navbar__ai-button-text">AI Tools</span>
        </button>

        {isAIPopoverOpen && (
          <div className="navbar__ai-popover">
            <div className="navbar__ai-popover-header">
              <span className="navbar__ai-popover-title">AI Assistants</span>
              <span className="navbar__ai-popover-subtitle">Launch tools on your device</span>
            </div>
            <div className="navbar__ai-grid">
              {aiTools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="navbar__ai-item"
                  onClick={() => setIsAIPopoverOpen(false)}
                  style={{ "--tool-accent": tool.color }}
                >
                  <div className="navbar__ai-icon-wrapper">
                    {tool.icon}
                  </div>
                  <span className="navbar__ai-item-name">{tool.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <ThemeToggle />

      {user && (
        <div className="navbar__profile-area">
          <Link to="/dashboard/profile" className="navbar__profile-link" aria-label="View profile">
            <Avatar id={user.avatarId} size={32} className="navbar__profile-avatar" />
          </Link>

          <div className="navbar__next-meet-popover" aria-live="polite">
            <div className="navbar__next-meet-heading">
              <Timer size={14} />
              <span>Next meet</span>
            </div>
            {upcomingMeeting ? (
              <>
                <strong className="navbar__next-meet-countdown">{formatCountdown(upcomingMeeting)}</strong>
                <span className="navbar__next-meet-project">{upcomingMeeting.projectName}</span>
                <span className="navbar__next-meet-meta">
                  {formatDateLabel(getMeetingDateTime(upcomingMeeting))} at {formatMeetingTime(upcomingMeeting)}
                </span>
              </>
            ) : (
              <span className="navbar__next-meet-empty">No upcoming meets</span>
            )}
          </div>
        </div>
      )}

      {isMeetModalOpen && (
        <div className="navbar__meet-modal-backdrop" role="presentation">
          <section className="navbar__meet-modal" role="dialog" aria-modal="true" aria-labelledby="meet-modal-title">
            <div className="navbar__meet-modal-header">
              <div>
                <h2 id="meet-modal-title">Add New Meet</h2>
                <p>Schedule a project meeting with date and timing.</p>
              </div>
              <button
                type="button"
                className="navbar__meet-modal-close"
                onClick={() => setIsMeetModalOpen(false)}
                aria-label="Close add meet form"
              >
                <X size={18} />
              </button>
            </div>

            <form className="navbar__meet-form" onSubmit={handleAddMeet}>
              <label className="navbar__meet-field">
                <span>Project name</span>
                <div className="navbar__meet-input-wrap">
                  <Video size={16} />
                  <input
                    type="text"
                    name="projectName"
                    value={meetForm.projectName}
                    onChange={handleMeetFormChange}
                    placeholder="Enter project name"
                    required
                  />
                </div>
              </label>

              <div className="navbar__meet-form-row">
                <label className="navbar__meet-field">
                  <span>Date</span>
                  <div className="navbar__meet-input-wrap">
                    <CalendarDays size={16} />
                    <input
                      type="date"
                      name="date"
                      value={meetForm.date}
                      onChange={handleMeetFormChange}
                      required
                    />
                  </div>
                </label>

                <label className="navbar__meet-field">
                  <span>Meeting time</span>
                  <div className="navbar__meet-input-wrap">
                    <Clock size={16} />
                    <input
                      type="time"
                      name="time"
                      value={meetForm.time}
                      onChange={handleMeetFormChange}
                      required
                    />
                  </div>
                </label>
              </div>

              <label className="navbar__meet-calendar-checkbox">
                <input
                  type="checkbox"
                  name="addToGoogleCalendar"
                  checked={meetForm.addToGoogleCalendar}
                  onChange={handleMeetFormChange}
                  disabled={!calendarConnected}
                />
                <span>Add to Google Calendar</span>
              </label>

              {!calendarConnected && (
                <p className="navbar__meet-calendar-note">
                  Connect Google Calendar from Profile to enable this option.
                </p>
              )}

              {meetError && <p className="navbar__meet-error">{meetError}</p>}

              <button type="submit" className="navbar__meet-submit" disabled={isCreatingMeet}>
                <Plus size={16} />
                {isCreatingMeet ? "Adding Meet" : "Add Meet to Schedule"}
              </button>
            </form>
          </section>
        </div>
      )}
    </header>
  );
}
