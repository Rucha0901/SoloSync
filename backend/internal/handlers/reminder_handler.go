package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"freelanceflow/internal/reminder"
)

// ReminderHandler wires the HTTP layer to the reminder Scheduler.
type ReminderHandler struct {
	scheduler *reminder.Scheduler
}

func NewReminderHandler(scheduler *reminder.Scheduler) *ReminderHandler {
	return &ReminderHandler{scheduler: scheduler}
}

// registerRequest is the payload the frontend sends when the user logs in or
// updates their project list. The scheduler replaces any existing entry for
// that email so no duplicates pile up.
type registerRequest struct {
	FreelancerEmail string           `json:"freelancerEmail"`
	Projects        []projectPayload `json:"projects"`
}

type projectPayload struct {
	Name    string `json:"name"`
	Client  string `json:"client"`
	DueDate string `json:"dueDate"` // ISO 8601 date: "2026-07-15"
}

// Register accepts a POST body, parses it, and registers the job with the
// in-memory scheduler so the next daily run will include it.
func (h *ReminderHandler) Register(w http.ResponseWriter, r *http.Request) {
	job, ok := h.parseJob(w, r)
	if !ok {
		return
	}

	h.scheduler.Register(job)

	writeJSON(w, http.StatusOK, apiResponse{
		Success: true,
		Message: "reminders registered — next check runs within 24 hours",
	})
}

// TriggerNow immediately runs a reminder check for the supplied payload.
// Useful for testing: POST /api/reminders/trigger-now with the same body
// format as /api/reminders/register.
func (h *ReminderHandler) TriggerNow(w http.ResponseWriter, r *http.Request) {
	job, ok := h.parseJob(w, r)
	if !ok {
		return
	}

	h.scheduler.Register(job)

	ctx, cancel := context.WithTimeout(r.Context(), sendTimeout)
	defer cancel()

	if errs := h.scheduler.RunJob(ctx, job); len(errs) > 0 {
		writeJSON(w, http.StatusInternalServerError, apiResponse{
			Message: fmt.Sprintf("reminder check completed with %d send error(s)", len(errs)),
		})
		return
	}

	writeJSON(w, http.StatusOK, apiResponse{
		Success: true,
		Message: "reminder check triggered immediately and registered for daily runs",
	})
}

func (h *ReminderHandler) parseJob(w http.ResponseWriter, r *http.Request) (reminder.DailyJob, bool) {
	var req registerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, apiResponse{Message: "request body must be valid JSON"})
		return reminder.DailyJob{}, false
	}

	if strings.TrimSpace(req.FreelancerEmail) == "" {
		writeJSON(w, http.StatusBadRequest, apiResponse{Message: "freelancerEmail is required"})
		return reminder.DailyJob{}, false
	}

	var projects []reminder.Project
	for _, p := range req.Projects {
		due, err := time.Parse("2006-01-02", p.DueDate)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, apiResponse{
				Message: "dueDate must be in YYYY-MM-DD format, got: " + p.DueDate,
			})
			return reminder.DailyJob{}, false
		}
		projects = append(projects, reminder.Project{
			Name:    strings.TrimSpace(p.Name),
			Client:  strings.TrimSpace(p.Client),
			DueDate: due,
		})
	}

	return reminder.DailyJob{
		FreelancerEmail: strings.TrimSpace(req.FreelancerEmail),
		Projects:        projects,
	}, true
}
