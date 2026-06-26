import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, ClipboardList, Flag } from "lucide-react";
import { ACTIVE_PROJECTS, getMonthCells, isSameDate } from "../services/scheduleService";
import "./Schedule.css";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DeadlineSchedule() {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

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
          <h1 className="schedule-page__title">Deadline Scheduling</h1>
          <p className="schedule-page__subtitle">
            See project due dates in a month-by-month planning calendar.
          </p>
        </div>
        <div className="schedule-page__summary">
          <ClipboardList size={18} />
          <span>{ACTIVE_PROJECTS.length} active deadlines</span>
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
            const dayDeadlines = date
              ? ACTIVE_PROJECTS.filter((project) => isSameDate(project.dueDate, date))
              : [];

            return (
              <div
                key={date ? date.toISOString() : `blank-${index}`}
                className={`schedule-day ${date ? "" : "schedule-day--empty"} ${dayDeadlines.length ? "schedule-day--has-deadline" : ""}`}
              >
                {date && (
                  <>
                    <span className="schedule-day__number">{date.getDate()}</span>
                    <div className="schedule-day__items">
                      {dayDeadlines.map((project) => (
                        <article key={project.id} className="schedule-deadline-chip">
                          <Flag size={14} />
                          <span className="schedule-meet-chip__project">{project.name}</span>
                          <span className="schedule-deadline-chip__client">{project.client}</span>
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
