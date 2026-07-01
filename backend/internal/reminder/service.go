package reminder

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"

	"freelanceflow/internal/email"
)

// Project holds the minimal data needed for reminder evaluation.
type Project struct {
	Name    string    `json:"name"`
	Client  string    `json:"client"`
	DueDate time.Time `json:"dueDate"`
}

// ReminderThresholds are the days-before-due at which reminders are sent.
var ReminderThresholds = []int{5, 3, 1}

// Service evaluates due dates and dispatches reminder emails.
type Service struct {
	emailSvc email.Service
	mu       sync.Mutex
	sent     map[string]struct{}
	now      func() time.Time
}

func NewService(emailSvc email.Service) *Service {
	return &Service{
		emailSvc: emailSvc,
		sent:     make(map[string]struct{}),
		now:      time.Now,
	}
}

// CheckAndSend inspects each project, determines which thresholds are hit
// relative to today, and sends a reminder email for each match.
func (s *Service) CheckAndSend(ctx context.Context, freelancerEmail string, projects []Project) []error {
	today := s.now().UTC().Truncate(24 * time.Hour)
	var errs []error

	for _, proj := range projects {
		due := proj.DueDate.UTC().Truncate(24 * time.Hour)
		daysLeft := int(due.Sub(today).Hours() / 24)

		if !isThreshold(daysLeft) {
			continue
		}

		key := reminderKey(freelancerEmail, proj, daysLeft)
		if s.wasSent(key) {
			continue
		}

		msg := buildReminderEmail(freelancerEmail, proj, daysLeft)
		if err := s.emailSvc.Send(ctx, msg); err != nil {
			errs = append(errs, fmt.Errorf("reminder for %q: %w", proj.Name, err))
			continue
		}

		s.markSent(key)
	}

	return errs
}

func reminderKey(email string, proj Project, daysLeft int) string {
	return strings.Join([]string{
		strings.ToLower(strings.TrimSpace(email)),
		strings.ToLower(strings.TrimSpace(proj.Name)),
		proj.DueDate.UTC().Format("2006-01-02"),
		fmt.Sprintf("%d", daysLeft),
	}, "|")
}

func (s *Service) wasSent(key string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	_, ok := s.sent[key]
	return ok
}

func (s *Service) markSent(key string) {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.sent[key] = struct{}{}
}

func isThreshold(daysLeft int) bool {
	for _, t := range ReminderThresholds {
		if daysLeft == t {
			return true
		}
	}
	return false
}

func buildReminderEmail(to string, proj Project, daysLeft int) email.Message {
	urgency := "upcoming"
	switch daysLeft {
	case 1:
		urgency = "🔴 URGENT — Due Tomorrow"
	case 3:
		urgency = "🟠 Due in 3 Days"
	case 5:
		urgency = "🟡 Due in 5 Days"
	}

	subject := fmt.Sprintf("[SoloSync] %s — Project \"%s\"", urgency, proj.Name)

	body := strings.Join([]string{
		"<!DOCTYPE html>",
		"<html><body style=\"font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:0\">",
		"<div style=\"max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)\">",
		"  <div style=\"background:linear-gradient(135deg,#2f6f4e,#4caf7d);padding:32px 40px\">",
		"    <h1 style=\"color:#ffffff;font-size:22px;margin:0;letter-spacing:-0.5px\">SoloSync Reminder</h1>",
		"    <p style=\"color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px\">Automated project deadline alert</p>",
		"  </div>",
		"  <div style=\"padding:32px 40px\">",
		fmt.Sprintf("    <p style=\"font-size:15px;color:#444;margin:0 0 20px\">Hi there,</p>"),
		fmt.Sprintf("    <p style=\"font-size:15px;color:#444;margin:0 0 24px\">This is your <strong>%s</strong> reminder for the following project:</p>", urgency),
		"    <div style=\"background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px 24px;margin:0 0 24px\">",
		fmt.Sprintf("      <p style=\"margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em\">Project</p>"),
		fmt.Sprintf("      <p style=\"margin:0 0 16px;font-size:18px;font-weight:700;color:#111827\">%s</p>", proj.Name),
		fmt.Sprintf("      <p style=\"margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em\">Client</p>"),
		fmt.Sprintf("      <p style=\"margin:0 0 16px;font-size:15px;color:#374151\">%s</p>", proj.Client),
		fmt.Sprintf("      <p style=\"margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em\">Due Date</p>"),
		fmt.Sprintf("      <p style=\"margin:0;font-size:15px;font-weight:600;color:#374151\">%s</p>", proj.DueDate.Format("Monday, January 2, 2006")),
		"    </div>",
		fmt.Sprintf("    <div style=\"background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:14px 18px;margin:0 0 24px\">"),
		fmt.Sprintf("      <p style=\"margin:0;font-size:14px;color:#92400e\">⏰ <strong>%d day%s remaining</strong> until the deadline. Make sure everything is on track!</p>", daysLeft, pluralDays(daysLeft)),
		"    </div>",
		"    <p style=\"font-size:14px;color:#6b7280;margin:0\">You are receiving this automated reminder because you are the account holder on SoloSync.</p>",
		"  </div>",
		"  <div style=\"background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center\">",
		"    <p style=\"margin:0;font-size:12px;color:#9ca3af\">SoloSync — Freelance Workspace Automation</p>",
		"  </div>",
		"</div>",
		"</body></html>",
	}, "\n")

	return email.Message{
		To:      []string{to},
		Subject: subject,
		Body:    body,
		IsHTML:  true,
	}
}

func pluralDays(n int) string {
	if n == 1 {
		return ""
	}
	return "s"
}
