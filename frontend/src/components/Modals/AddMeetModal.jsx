import { useEffect, useRef, useState } from "react";
import { X, Video, Calendar, Clock, Link, ChevronDown } from "lucide-react";
import { ACTIVE_PROJECTS } from "../../services/scheduleService";
import "./AddMeetModal.css";

export default function AddMeetModal({ onClose, onSave }) {
  const [projectName, setProjectName] = useState("");
  const [customProject, setCustomProject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);

  // Focus trap
  useEffect(() => {
    firstInputRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Default date to today
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    setDate(`${yyyy}-${mm}-${dd}`);
    setTime("10:00");
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const validate = () => {
    const errs = {};
    const resolvedProject = projectName === "__custom__" ? customProject.trim() : projectName;
    if (!resolvedProject) errs.project = "Please select or enter a project name.";
    if (!date) errs.date = "Please pick a date.";
    if (!time) errs.time = "Please pick a time.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);

    const resolvedProject =
      projectName === "__custom__" ? customProject.trim() : projectName;

    await onSave({ projectName: resolvedProject, date, time, meetLink: meetLink.trim() || undefined });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="add-meet-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-meet-title"
    >
      <div className="add-meet-modal">
        {/* Header */}
        <div className="add-meet-modal__header">
          <div className="add-meet-modal__header-icon">
            <Video size={20} />
          </div>
          <div>
            <h2 id="add-meet-title" className="add-meet-modal__title">
              Schedule a Meeting
            </h2>
            <p className="add-meet-modal__subtitle">
              Add a new client meeting to your schedule
            </p>
          </div>
          <button
            type="button"
            className="add-meet-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="add-meet-modal__form" noValidate>
          {/* Project */}
          <div className="add-meet-field">
            <label htmlFor="meet-project" className="add-meet-field__label">
              Project / Client
            </label>
            <div className="add-meet-field__select-wrap">
              <select
                id="meet-project"
                ref={firstInputRef}
                className={`add-meet-field__select ${errors.project ? "add-meet-field__select--error" : ""}`}
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  setErrors((prev) => ({ ...prev, project: undefined }));
                }}
              >
                <option value="">— Select a project —</option>
                {ACTIVE_PROJECTS.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
                <option value="__custom__">Other (type below)</option>
              </select>
              <ChevronDown size={16} className="add-meet-field__select-icon" />
            </div>
            {projectName === "__custom__" && (
              <input
                type="text"
                placeholder="Enter project or client name"
                className={`add-meet-field__input ${errors.project ? "add-meet-field__input--error" : ""}`}
                value={customProject}
                onChange={(e) => {
                  setCustomProject(e.target.value);
                  setErrors((prev) => ({ ...prev, project: undefined }));
                }}
              />
            )}
            {errors.project && (
              <span className="add-meet-field__error">{errors.project}</span>
            )}
          </div>

          {/* Date & Time Row */}
          <div className="add-meet-row">
            <div className="add-meet-field">
              <label htmlFor="meet-date" className="add-meet-field__label">
                <Calendar size={14} style={{ marginRight: 6 }} />
                Date
              </label>
              <input
                id="meet-date"
                type="date"
                className={`add-meet-field__input ${errors.date ? "add-meet-field__input--error" : ""}`}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setErrors((prev) => ({ ...prev, date: undefined }));
                }}
              />
              {errors.date && (
                <span className="add-meet-field__error">{errors.date}</span>
              )}
            </div>

            <div className="add-meet-field">
              <label htmlFor="meet-time" className="add-meet-field__label">
                <Clock size={14} style={{ marginRight: 6 }} />
                Time
              </label>
              <input
                id="meet-time"
                type="time"
                className={`add-meet-field__input ${errors.time ? "add-meet-field__input--error" : ""}`}
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  setErrors((prev) => ({ ...prev, time: undefined }));
                }}
              />
              {errors.time && (
                <span className="add-meet-field__error">{errors.time}</span>
              )}
            </div>
          </div>

          {/* Meet Link (optional) */}
          <div className="add-meet-field">
            <label htmlFor="meet-link" className="add-meet-field__label">
              <Link size={14} style={{ marginRight: 6 }} />
              Meeting Link
              <span className="add-meet-field__optional">(optional)</span>
            </label>
            <input
              id="meet-link"
              type="url"
              placeholder="https://meet.google.com/..."
              className="add-meet-field__input"
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="add-meet-modal__actions">
            <button type="button" className="add-meet-modal__cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="add-meet-modal__submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="add-meet-modal__spinner" />
                  Scheduling…
                </>
              ) : (
                <>
                  <Video size={16} />
                  Schedule Meeting
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
