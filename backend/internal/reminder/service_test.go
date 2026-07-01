package reminder

import (
	"context"
	"testing"
	"time"

	"freelanceflow/internal/email"
)

type fakeEmailService struct {
	messages []email.Message
	err      error
}

func (f *fakeEmailService) Send(ctx context.Context, msg email.Message) error {
	if f.err != nil {
		return f.err
	}
	f.messages = append(f.messages, msg)
	return nil
}

func TestCheckAndSendSendsOnlyThresholdReminders(t *testing.T) {
	emailSvc := &fakeEmailService{}
	svc := NewService(emailSvc)
	svc.now = func() time.Time {
		return time.Date(2026, 6, 26, 10, 0, 0, 0, time.UTC)
	}

	errs := svc.CheckAndSend(context.Background(), "freelancer@example.com", []Project{
		{
			Name:    "Due in 5",
			Client:  "Client A",
			DueDate: time.Date(2026, 7, 1, 0, 0, 0, 0, time.UTC),
		},
		{
			Name:    "Due in 3",
			Client:  "Client B",
			DueDate: time.Date(2026, 6, 29, 0, 0, 0, 0, time.UTC),
		},
		{
			Name:    "Due in 1",
			Client:  "Client C",
			DueDate: time.Date(2026, 6, 27, 0, 0, 0, 0, time.UTC),
		},
		{
			Name:    "Due in 2",
			Client:  "Client D",
			DueDate: time.Date(2026, 6, 28, 0, 0, 0, 0, time.UTC),
		},
	})

	if len(errs) > 0 {
		t.Fatalf("expected no send errors, got %v", errs)
	}
	if got, want := len(emailSvc.messages), 3; got != want {
		t.Fatalf("sent messages = %d, want %d", got, want)
	}
	for _, msg := range emailSvc.messages {
		if len(msg.To) != 1 || msg.To[0] != "freelancer@example.com" {
			t.Fatalf("message recipient = %v, want freelancer@example.com", msg.To)
		}
		if !msg.IsHTML {
			t.Fatal("expected reminder email to be HTML")
		}
	}
}

func TestCheckAndSendDeduplicatesSameThreshold(t *testing.T) {
	emailSvc := &fakeEmailService{}
	svc := NewService(emailSvc)
	svc.now = func() time.Time {
		return time.Date(2026, 6, 26, 10, 0, 0, 0, time.UTC)
	}

	projects := []Project{
		{
			Name:    "Brand Identity",
			Client:  "Wayne Enterprises",
			DueDate: time.Date(2026, 6, 27, 0, 0, 0, 0, time.UTC),
		},
	}

	svc.CheckAndSend(context.Background(), "freelancer@example.com", projects)
	svc.CheckAndSend(context.Background(), "freelancer@example.com", projects)

	if got, want := len(emailSvc.messages), 1; got != want {
		t.Fatalf("sent messages after duplicate checks = %d, want %d", got, want)
	}
}
