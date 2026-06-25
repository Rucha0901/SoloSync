package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"freelanceflow/internal/email"
)

const sendTimeout = 15 * time.Second

type EmailHandler struct {
	service email.Service
}

func NewEmailHandler(service email.Service) *EmailHandler {
	return &EmailHandler{service: service}
}

type sendEmailRequest struct {
	To      []string `json:"to"`
	Subject string   `json:"subject"`
	Body    string   `json:"body"`
	IsHTML  bool     `json:"isHtml"`
}

type apiResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func (h *EmailHandler) SendEmail(w http.ResponseWriter, r *http.Request) {
	var req sendEmailRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, apiResponse{Message: "request body must be valid JSON"})
		return
	}

	if len(req.To) == 0 || strings.TrimSpace(req.Subject) == "" || strings.TrimSpace(req.Body) == "" {
		writeJSON(w, http.StatusBadRequest, apiResponse{Message: "to, subject, and body are required"})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), sendTimeout)
	defer cancel()

	msg := email.Message{
		To:      req.To,
		Subject: req.Subject,
		Body:    req.Body,
		IsHTML:  req.IsHTML,
	}

	if err := h.service.Send(ctx, msg); err != nil {
		writeJSON(w, http.StatusInternalServerError, apiResponse{Message: err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, apiResponse{Success: true, Message: "email sent successfully"})
}

func writeJSON(w http.ResponseWriter, status int, payload apiResponse) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payload)
}
