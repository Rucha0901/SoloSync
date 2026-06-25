package email

import (
	"context"
	"fmt"
	"net/smtp"
	"strings"

	"freelanceflow/internal/config"
)

// SMTPService sends email over SMTP using credentials supplied via
// environment variables. It implements the Service interface.
type SMTPService struct {
	cfg config.SMTPConfig
}

func NewSMTPService(cfg config.SMTPConfig) *SMTPService {
	return &SMTPService{cfg: cfg}
}

func (s *SMTPService) Send(ctx context.Context, msg Message) error {
	if err := ctx.Err(); err != nil {
		return err
	}

	if err := validate(msg); err != nil {
		return err
	}

	addr := fmt.Sprintf("%s:%s", s.cfg.Host, s.cfg.Port)
	auth := smtp.PlainAuth("", s.cfg.Username, s.cfg.Password, s.cfg.Host)
	body := buildBody(s.cfg.From, msg)

	if err := smtp.SendMail(addr, auth, s.cfg.From, msg.To, body); err != nil {
		return fmt.Errorf("smtp send failed: %w", err)
	}

	return nil
}

func validate(msg Message) error {
	if len(msg.To) == 0 {
		return fmt.Errorf("at least one recipient is required")
	}
	if strings.TrimSpace(msg.Subject) == "" {
		return fmt.Errorf("subject is required")
	}
	if strings.TrimSpace(msg.Body) == "" {
		return fmt.Errorf("body is required")
	}
	return nil
}

func buildBody(from string, msg Message) []byte {
	contentType := "text/plain; charset=\"UTF-8\""
	if msg.IsHTML {
		contentType = "text/html; charset=\"UTF-8\""
	}

	var b strings.Builder
	fmt.Fprintf(&b, "From: %s\r\n", from)
	fmt.Fprintf(&b, "To: %s\r\n", strings.Join(msg.To, ", "))
	fmt.Fprintf(&b, "Subject: %s\r\n", msg.Subject)
	b.WriteString("MIME-Version: 1.0\r\n")
	fmt.Fprintf(&b, "Content-Type: %s\r\n", contentType)
	b.WriteString("\r\n")
	b.WriteString(msg.Body)

	return []byte(b.String())
}
