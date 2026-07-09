package calendar

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"
	"time"

	"freelanceflow/internal/config"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	calendarapi "google.golang.org/api/calendar/v3"
	"google.golang.org/api/option"
)

const oauthStateTTL = 10 * time.Minute

type Service struct {
	store       *Store
	oauthConfig *oauth2.Config
	frontendURL string
}

type EventRequest struct {
	UserEmail       string   `json:"userEmail"`
	Summary         string   `json:"summary"`
	Description     string   `json:"description"`
	Location        string   `json:"location"`
	Start           string   `json:"start"`
	End             string   `json:"end"`
	TimeZone        string   `json:"timeZone"`
	AttendeeEmails  []string `json:"attendeeEmails"`
	ReminderMinutes int64    `json:"reminderMinutes"`
}

type EventResult struct {
	ID       string `json:"id"`
	HTMLLink string `json:"htmlLink"`
}

func NewService(store *Store, cfg config.GoogleConfig) (*Service, error) {
	if cfg.ClientID == "" || cfg.ClientSecret == "" || cfg.RedirectURL == "" {
		return nil, errors.New("google oauth configuration is incomplete")
	}

	return &Service{
		store: store,
		oauthConfig: &oauth2.Config{
			ClientID:     cfg.ClientID,
			ClientSecret: cfg.ClientSecret,
			RedirectURL:  cfg.RedirectURL,
			Scopes:       []string{calendarapi.CalendarEventsScope},
			Endpoint:     google.Endpoint,
		},
		frontendURL: cfg.FrontendURL,
	}, nil
}

func (s *Service) AuthURL(ctx context.Context, userEmail string) (string, error) {
	if strings.TrimSpace(userEmail) == "" {
		return "", errors.New("userEmail is required")
	}

	state, err := randomState()
	if err != nil {
		return "", err
	}

	if err := s.store.SaveOAuthState(ctx, state, userEmail, time.Now().Add(oauthStateTTL)); err != nil {
		return "", err
	}

	return s.oauthConfig.AuthCodeURL(
		state,
		oauth2.AccessTypeOffline,
		oauth2.ApprovalForce,
	), nil
}

func (s *Service) ExchangeCallback(ctx context.Context, code, state string) (string, error) {
	if strings.TrimSpace(code) == "" {
		return "", errors.New("authorization code is required")
	}

	userEmail, err := s.store.ConsumeOAuthState(ctx, state)
	if err != nil {
		return "", err
	}

	token, err := s.oauthConfig.Exchange(ctx, code)
	if err != nil {
		return "", fmt.Errorf("exchange google authorization code: %w", err)
	}

	if err := s.store.SaveToken(ctx, userEmail, token); err != nil {
		return "", err
	}

	return userEmail, nil
}

func (s *Service) ConnectedRedirectURL() string {
	base := strings.TrimRight(strings.TrimSpace(s.frontendURL), "/")
	if base == "" {
		return "/dashboard/profile?googleCalendar=connected"
	}
	return base + "/dashboard/profile?googleCalendar=connected"
}

func (s *Service) IsConnected(ctx context.Context, userEmail string) (bool, error) {
	return s.store.HasToken(ctx, userEmail)
}

func (s *Service) CreateEvent(ctx context.Context, req EventRequest) (*EventResult, error) {
	if err := req.validate(); err != nil {
		return nil, err
	}

	token, err := s.store.GetToken(ctx, req.UserEmail)
	if err != nil {
		return nil, err
	}

	tokenSource := s.oauthConfig.TokenSource(ctx, token)
	freshToken, err := tokenSource.Token()
	if err != nil {
		return nil, fmt.Errorf("refresh google token: %w", err)
	}
	if freshToken.AccessToken != token.AccessToken || !freshToken.Expiry.Equal(token.Expiry) {
		if err := s.store.SaveToken(ctx, req.UserEmail, freshToken); err != nil {
			return nil, err
		}
	}

	calendarSvc, err := calendarapi.NewService(ctx, option.WithHTTPClient(s.oauthConfig.Client(ctx, freshToken)))
	if err != nil {
		return nil, err
	}

	event := req.toGoogleEvent()
	created, err := calendarSvc.Events.Insert("primary", event).Context(ctx).SendUpdates("all").Do()
	if err != nil {
		return nil, fmt.Errorf("create google calendar event: %w", err)
	}

	return &EventResult{ID: created.Id, HTMLLink: created.HtmlLink}, nil
}

func (r EventRequest) validate() error {
	if strings.TrimSpace(r.UserEmail) == "" {
		return errors.New("userEmail is required")
	}
	if strings.TrimSpace(r.Summary) == "" {
		return errors.New("summary is required")
	}
	if _, err := parseEventTime(r.Start); err != nil {
		return errors.New("start must be a valid RFC3339 datetime")
	}
	start, _ := parseEventTime(r.Start)
	end, err := parseEventTime(r.End)
	if err != nil {
		return errors.New("end must be a valid RFC3339 datetime")
	}
	if !end.After(start) {
		return errors.New("end must be after start")
	}
	return nil
}

func (r EventRequest) toGoogleEvent() *calendarapi.Event {
	timeZone := strings.TrimSpace(r.TimeZone)
	if timeZone == "" {
		timeZone = "UTC"
	}

	reminderMinutes := r.ReminderMinutes
	if reminderMinutes <= 0 {
		reminderMinutes = 10
	}

	event := &calendarapi.Event{
		Summary:     strings.TrimSpace(r.Summary),
		Description: strings.TrimSpace(r.Description),
		Location:    strings.TrimSpace(r.Location),
		Start: &calendarapi.EventDateTime{
			DateTime: r.Start,
			TimeZone: timeZone,
		},
		End: &calendarapi.EventDateTime{
			DateTime: r.End,
			TimeZone: timeZone,
		},
		Reminders: &calendarapi.EventReminders{
			UseDefault: false,
			Overrides: []*calendarapi.EventReminder{
				{Method: "email", Minutes: 60},
				{Method: "popup", Minutes: 30},
			},
		},
	}

	for _, email := range r.AttendeeEmails {
		email = strings.TrimSpace(email)
		if email != "" {
			event.Attendees = append(event.Attendees, &calendarapi.EventAttendee{Email: email})
		}
	}

	return event
}

func parseEventTime(value string) (time.Time, error) {
	return time.Parse(time.RFC3339, value)
}

func randomState() (string, error) {
	buf := make([]byte, 32)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(buf), nil
}
