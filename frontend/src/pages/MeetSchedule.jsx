import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Video } from "lucide-react";
import {
  SCHEDULE_UPDATED_EVENT,
  formatMeetingTime,
  getMeetings,
  getMonthCells,
  isSameDate,
} from "../services/scheduleService";
import "./Schedule.css";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MeetSchedule() {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [meetings, setMeetings] = useState(() => getMeetings());

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

  const monthCells = useMemo(
    () => getMonthCells(cursor.getFullYear(), cursor.getMonth()),
    [cursor]
  );

  const monthLabel = cursor.toLocaleDateString([], {
    month: "long",
    year: "numeric",
  });

  const moveMonth = (direction) => {
    setCursor((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  };

  return (
    <div className="schedule-page">
      <header className="schedule-page__header">
        <div>
          <h1 className="schedule-page__title">Meet Scheduling</h1>
          <p className="schedule-page__subtitle">
            Track client meetings by project, date, and time.
          </p>
        </div>
        <div className="schedule-page__summary">
          <Video size={18} />
          <span>{meetings.length} scheduled meet{meetings.length === 1 ? "" : "s"}</span>
        </div>
      </header>

      <section className="schedule-calendar">
        <div className="schedule-calendar__toolbar">
          <button type="button" className="schedule-calendar__nav" onClick={() => moveMonth(-1)} aria-label="Previous month">
            <ChevronLeft size={18} />
          </button>
          <div className="schedule-calendar__month">
            <CalendarDays size={20} />
            <span>{monthLabel}</span>
          </div>
          <button type="button" className="schedule-calendar__nav" onClick={() => moveMonth(1)} aria-label="Next month">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="schedule-grid schedule-grid--weekdays">
          {weekDays.map((day) => (
            <div key={day} className="schedule-grid__weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="schedule-grid">
          {monthCells.map((date, index) => {
            const dayMeetings = date
              ? meetings
                  .filter((meeting) => isSameDate(meeting.date, date))
                  .sort((a, b) => a.time.localeCompare(b.time))
              : [];

            return (
              <div
                key={date ? date.toISOString() : `blank-${index}`}
                className={`schedule-day ${date ? "" : "schedule-day--empty"} ${dayMeetings.length ? "schedule-day--has-meet" : ""}`}
              >
                {date && (
                  <>
                    <span className="schedule-day__number">{date.getDate()}</span>
                    <div className="schedule-day__items">
                      {dayMeetings.map((meeting) => (
                        <article key={meeting.id} className="schedule-meet-chip">
                          <Video size={14} />
                          <span className="schedule-meet-chip__project">{meeting.projectName}</span>
                          <span className="schedule-meet-chip__time">
                            <Clock size={12} />
                            {formatMeetingTime(meeting)}
                          </span>
                        </article>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
