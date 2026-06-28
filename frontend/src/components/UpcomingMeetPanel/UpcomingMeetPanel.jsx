import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Video, ChevronLeft, ChevronRight, Sparkles, ExternalLink } from "lucide-react";
import {
  SCHEDULE_UPDATED_EVENT,
  getMeetings,
  getMeetingDateTime,
  formatMeetingTime,
  formatDateLabel,
} from "../../services/scheduleService";
import "./UpcomingMeetPanel.css";

export default function UpcomingMeetPanel() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("solosync-meet-panel-collapsed") === "true";
    }
    return false;
  });

  const [meetings, setMeetings] = useState(() => getMeetings());
  const [now, setNow] = useState(new Date());

  // Listen to schedule updates and storage events
  useEffect(() => {
    function refresh() {
      setMeetings(getMeetings());
    }
    window.addEventListener(SCHEDULE_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(SCHEDULE_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  // Update now every second for the countdown ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("solosync-meet-panel-collapsed", String(next));
      return next;
    });
  };

  // Find the current active meeting or next upcoming meeting
  const nextMeet = useMemo(() => {
    const activeDuration = 45 * 60 * 1000; // 45 minutes duration
    const sorted = [...meetings].sort((a, b) => getMeetingDateTime(a) - getMeetingDateTime(b));

    // Check if there is an active meeting currently running
    const active = sorted.find((m) => {
      const dt = getMeetingDateTime(m);
      const diff = now - dt;
      return diff >= 0 && diff < activeDuration;
    });

    if (active) return active;

    // Otherwise find the next future meeting
    return sorted.find((m) => getMeetingDateTime(m) >= now);
  }, [meetings, now]);

  // Calculate countdown time components
  const countdown = useMemo(() => {
    if (!nextMeet) return null;

    const meetTime = getMeetingDateTime(nextMeet);
    const diff = meetTime - now;

    if (diff <= 0) {
      // Meeting has started
      const duration = 45 * 60 * 1000;
      const isHappening = -diff < duration;
      return { total: diff, isHappening, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return { total: diff, isHappening: false, days, hours, minutes, seconds };
  }, [nextMeet, now]);

  if (isCollapsed) {
    return (
      <aside className="meet-panel meet-panel--collapsed" aria-label="Upcoming Meet Sidebar Mini">
        <button
          type="button"
          className="meet-panel__toggle meet-panel__toggle--collapsed"
          onClick={toggleCollapsed}
          aria-label="Expand Upcoming Meet panel"
          title="Expand Upcoming Meet panel"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="meet-panel__mini-content">
          <div className="meet-panel__mini-badge">
            <Video size={16} />
          </div>
          <span className="meet-panel__mini-text">Upcoming Meet</span>
          {nextMeet && countdown && (
            <div className={`meet-panel__mini-status ${countdown.isHappening ? "meet-panel__mini-status--active" : ""}`}>
              {countdown.isHappening ? (
                <span className="meet-panel__pulse-dot" />
              ) : (
                <span>
                  {countdown.days > 0 ? `${countdown.days}d` : `${String(countdown.hours).padStart(2, "0")}:${String(countdown.minutes).padStart(2, "0")}`}
                </span>
              )}
            </div>
          )}
        </div>
      </aside>
    );
  }

  return (
    <aside className="meet-panel" aria-label="Upcoming Meet Sidebar">
      <div className="meet-panel__header">
        <div className="meet-panel__title-group">
          <Sparkles className="meet-panel__title-icon" size={16} />
          <h2 className="meet-panel__title">Next Meet</h2>
        </div>
        <button
          type="button"
          className="meet-panel__toggle"
          onClick={toggleCollapsed}
          aria-label="Collapse Upcoming Meet panel"
          title="Collapse Upcoming Meet panel"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="meet-panel__body">
        {nextMeet ? (
          <div className="meet-panel__content">
            <div className="meet-card">
              <div className="meet-card__header">
                <Video size={18} className="meet-card__icon" />
                <span className="meet-card__project">{nextMeet.projectName}</span>
              </div>

              <div className="meet-card__details">
                <div className="meet-card__detail-item">
                  <Calendar size={14} />
                  <span>{formatDateLabel(getMeetingDateTime(nextMeet))}</span>
                </div>
                <div className="meet-card__detail-item">
                  <Clock size={14} />
                  <span>{formatMeetingTime(nextMeet)}</span>
                </div>
              </div>

              {countdown && (
                <div className="meet-countdown">
                  {countdown.isHappening ? (
                    <div className="meet-countdown__active">
                      <span className="meet-panel__pulse-dot meet-panel__pulse-dot--large" />
                      <span className="meet-countdown__active-text">Happening Now!</span>
                    </div>
                  ) : (
                    <>
                      <span className="meet-countdown__label">Starts In</span>
                      <div className="meet-countdown__grid">
                        {countdown.days > 0 && (
                          <div className="meet-countdown__item">
                            <span className="meet-countdown__value">{countdown.days}</span>
                            <span className="meet-countdown__unit">days</span>
                          </div>
                        )}
                        <div className="meet-countdown__item">
                          <span className="meet-countdown__value">
                            {String(countdown.hours).padStart(2, "0")}
                          </span>
                          <span className="meet-countdown__unit">hours</span>
                        </div>
                        <div className="meet-countdown__item">
                          <span className="meet-countdown__value">
                            {String(countdown.minutes).padStart(2, "0")}
                          </span>
                          <span className="meet-countdown__unit">mins</span>
                        </div>
                        <div className="meet-countdown__item">
                          <span className="meet-countdown__value">
                            {String(countdown.seconds).padStart(2, "0")}
                          </span>
                          <span className="meet-countdown__unit">secs</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link to="/dashboard/meet-schedule" className="meet-panel__link">
              <span>View Meet Schedule</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        ) : (
          <div className="meet-panel__empty">
            <div className="meet-panel__empty-icon">📅</div>
            <p className="meet-panel__empty-text">No upcoming meetings scheduled.</p>
            <Link to="/dashboard/meet-schedule" className="meet-panel__empty-btn">
              Schedule a Meet
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
