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

type welcomeEmailRequest struct {
	ClientEmail     string  `json:"clientEmail"`
	ClientName      string  `json:"clientName"`
	ProjectName     string  `json:"projectName"`
	FreelancerName  string  `json:"freelancerName"`
	FreelancerEmail string  `json:"freelancerEmail"`
	DueDate         string  `json:"dueDate"`
	Budget          float64 `json:"budget"`
}

type thankYouEmailRequest struct {
	ClientEmail    string `json:"clientEmail"`
	ClientName     string `json:"clientName"`
	ProjectName    string `json:"projectName"`
	FreelancerName string `json:"freelancerName"`
}

func (h *EmailHandler) SendWelcomeEmail(w http.ResponseWriter, r *http.Request) {
	var req welcomeEmailRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, apiResponse{Message: "request body must be valid JSON"})
		return
	}

	if strings.TrimSpace(req.ClientEmail) == "" || strings.TrimSpace(req.ProjectName) == "" {
		writeJSON(w, http.StatusBadRequest, apiResponse{Message: "clientEmail and projectName are required"})
		return
	}

	if req.FreelancerName == "" {
		req.FreelancerName = "Your Freelancer"
	}

	subject := "Welcome! Project \"" + req.ProjectName + "\" has officially started"

	body := strings.Join([]string{
		"<!DOCTYPE html>",
		"<html><body style=\"font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:0\">",
		"<div style=\"max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)\">",
		"  <div style=\"background:linear-gradient(135deg,#1e3a8a,#3b82f6);padding:32px 40px\">",
		"    <h1 style=\"color:#ffffff;font-size:22px;margin:0;letter-spacing:-0.5px\">Project Kickoff!</h1>",
		"    <p style=\"color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px\">SoloSync Workspace Notification</p>",
		"  </div>",
		"  <div style=\"padding:32px 40px\">",
		"    <p style=\"font-size:15px;color:#444;margin:0 0 20px\">Hi " + req.ClientName + ",</p>",
		"    <p style=\"font-size:15px;color:#444;margin:0 0 24px\">I'm excited to let you know that we have kicked off the project: <strong>" + req.ProjectName + "</strong>.</p>",
		"    <div style=\"background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px 24px;margin:0 0 24px\">",
		"      <p style=\"margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em\">Project Name</p>",
		"      <p style=\"margin:0 0 16px;font-size:18px;font-weight:700;color:#111827\">" + req.ProjectName + "</p>",
		"      <p style=\"margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em\">Freelancer</p>",
		"      <p style=\"margin:0 0 16px;font-size:15px;color:#374151\">" + req.FreelancerName + " (" + req.FreelancerEmail + ")</p>",
		"      <p style=\"margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em\">Estimated Due Date</p>",
		"      <p style=\"margin:0;font-size:15px;font-weight:600;color:#374151\">" + req.DueDate + "</p>",
		"    </div>",
		"    <p style=\"font-size:15px;color:#444;margin:0 0 20px\">You will receive updates on milestones and progress directly from my SoloSync workspace.</p>",
		"    <p style=\"font-size:15px;color:#444;margin:0\">Best regards,<br><strong>" + req.FreelancerName + "</strong></p>",
		"  </div>",
		"  <div style=\"background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center\">",
		"    <p style=\"margin:0;font-size:12px;color:#9ca3af\">Powered by SoloSync — Freelance Workspace Automation</p>",
		"  </div>",
		"</div>",
		"</body></html>",
	}, "\n")

	ctx, cancel := context.WithTimeout(r.Context(), sendTimeout)
	defer cancel()

	msg := email.Message{
		To:      []string{req.ClientEmail},
		Subject: subject,
		Body:    body,
		IsHTML:  true,
	}

	if err := h.service.Send(ctx, msg); err != nil {
		writeJSON(w, http.StatusInternalServerError, apiResponse{Message: err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, apiResponse{Success: true, Message: "welcome email sent to client successfully"})
}

func (h *EmailHandler) SendThankYouEmail(w http.ResponseWriter, r *http.Request) {
	var req thankYouEmailRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, apiResponse{Message: "request body must be valid JSON"})
		return
	}

	if strings.TrimSpace(req.ClientEmail) == "" || strings.TrimSpace(req.ProjectName) == "" {
		writeJSON(w, http.StatusBadRequest, apiResponse{Message: "clientEmail and projectName are required"})
		return
	}

	if req.FreelancerName == "" {
		req.FreelancerName = "Your Freelancer"
	}

	subject := "Project Completed! Thank you for the opportunity — \"" + req.ProjectName + "\""

	body := strings.Join([]string{
		"<!DOCTYPE html>",
		"<html><body style=\"font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:0\">",
		"<div style=\"max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)\">",
		"  <div style=\"background:linear-gradient(135deg,#047857,#10b981);padding:32px 40px\">",
		"    <h1 style=\"color:#ffffff;font-size:22px;margin:0;letter-spacing:-0.5px\">Project Completed!</h1>",
		"    <p style=\"color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px\">SoloSync Workspace Notification</p>",
		"  </div>",
		"  <div style=\"padding:32px 40px\">",
		"    <p style=\"font-size:15px;color:#444;margin:0 0 20px\">Hi " + req.ClientName + ",</p>",
		"    <p style=\"font-size:15px;color:#444;margin:0 0 24px\">I'm thrilled to inform you that we have completed all deliverables for: <strong>" + req.ProjectName + "</strong>!</p>",
		"    <div style=\"background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px 24px;margin:0 0 24px\">",
		"      <p style=\"margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em\">Project Name</p>",
		"      <p style=\"margin:0 0 16px;font-size:18px;font-weight:700;color:#111827\">" + req.ProjectName + "</p>",
		"      <p style=\"margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em\">Completed On</p>",
		"      <p style=\"margin:0;font-size:15px;font-weight:600;color:#374151\">" + time.Now().Format("Monday, January 2, 2006") + "</p>",
		"    </div>",
		"    <p style=\"font-size:15px;color:#444;margin:0 0 20px\">Thank you so much for the opportunity to work together. Please let me know if you need any follow-up help or have feedback to share.</p>",
		"    <p style=\"font-size:15px;color:#444;margin:0\">Best regards,<br><strong>" + req.FreelancerName + "</strong></p>",
		"  </div>",
		"  <div style=\"background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center\">",
		"    <p style=\"margin:0;font-size:12px;color:#9ca3af\">Powered by SoloSync — Freelance Workspace Automation</p>",
		"  </div>",
		"</div>",
		"</body></html>",
	}, "\n")

	ctx, cancel := context.WithTimeout(r.Context(), sendTimeout)
	defer cancel()

	msg := email.Message{
		To:      []string{req.ClientEmail},
		Subject: subject,
		Body:    body,
		IsHTML:  true,
	}

	if err := h.service.Send(ctx, msg); err != nil {
		writeJSON(w, http.StatusInternalServerError, apiResponse{Message: err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, apiResponse{Success: true, Message: "thank you email sent to client successfully"})
}
