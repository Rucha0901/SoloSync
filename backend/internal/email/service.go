package email

import "context"

// Message represents a single email to be sent. It is transport-agnostic so
// any Service implementation (SMTP today, another provider later) can consume it.
type Message struct {
	To      []string
	Subject string
	Body    string
	IsHTML  bool
}

// Service is the contract the rest of the application depends on. Keeping
// this as an interface lets the SMTP implementation be replaced or extended
// (e.g. for queued/automated sends) without touching any caller.
type Service interface {
	Send(ctx context.Context, msg Message) error
}
