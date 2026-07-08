package calendar

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"

	"golang.org/x/oauth2"
	_ "modernc.org/sqlite"
)

type Store struct {
	db *sql.DB
}

type OAuthState struct {
	State     string
	UserEmail string
	ExpiresAt time.Time
}

func NewStore(path string) (*Store, error) {
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, err
	}

	store := &Store{db: db}
	if err := store.migrate(); err != nil {
		db.Close()
		return nil, err
	}

	return store, nil
}

func (s *Store) Close() error {
	return s.db.Close()
}

func (s *Store) migrate() error {
	_, err := s.db.Exec(`
CREATE TABLE IF NOT EXISTS google_calendar_tokens (
	user_email TEXT PRIMARY KEY,
	access_token TEXT NOT NULL,
	refresh_token TEXT NOT NULL,
	expiry INTEGER NOT NULL,
	connectedAt INTEGER NOT NULL,
	updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS google_oauth_states (
	state TEXT PRIMARY KEY,
	user_email TEXT NOT NULL,
	expires_at INTEGER NOT NULL,
	created_at INTEGER NOT NULL
);
`)
	return err
}

func (s *Store) SaveOAuthState(ctx context.Context, state, userEmail string, expiresAt time.Time) error {
	state = strings.TrimSpace(state)
	userEmail = normalizeEmail(userEmail)
	if state == "" || userEmail == "" {
		return errors.New("state and user email are required")
	}

	now := time.Now().Unix()
	_, err := s.db.ExecContext(ctx, `
INSERT INTO google_oauth_states (state, user_email, expires_at, created_at)
VALUES (?, ?, ?, ?)
ON CONFLICT(state) DO UPDATE SET user_email = excluded.user_email, expires_at = excluded.expires_at
`, state, userEmail, expiresAt.Unix(), now)
	return err
}

func (s *Store) ConsumeOAuthState(ctx context.Context, state string) (string, error) {
	state = strings.TrimSpace(state)
	if state == "" {
		return "", errors.New("state is required")
	}

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return "", err
	}
	defer tx.Rollback()

	var userEmail string
	var expiresAt int64
	err = tx.QueryRowContext(ctx, `
SELECT user_email, expires_at FROM google_oauth_states WHERE state = ?
`, state).Scan(&userEmail, &expiresAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", errors.New("oauth state is invalid")
		}
		return "", err
	}

	if time.Now().Unix() > expiresAt {
		_, _ = tx.ExecContext(ctx, `DELETE FROM google_oauth_states WHERE state = ?`, state)
		return "", errors.New("oauth state has expired")
	}

	if _, err := tx.ExecContext(ctx, `DELETE FROM google_oauth_states WHERE state = ?`, state); err != nil {
		return "", err
	}

	if err := tx.Commit(); err != nil {
		return "", err
	}

	return userEmail, nil
}

func (s *Store) SaveToken(ctx context.Context, userEmail string, token *oauth2.Token) error {
	userEmail = normalizeEmail(userEmail)
	if userEmail == "" {
		return errors.New("user email is required")
	}
	if token == nil || token.AccessToken == "" {
		return errors.New("access token is required")
	}

	refreshToken := token.RefreshToken
	if refreshToken == "" {
		existing, err := s.GetToken(ctx, userEmail)
		if err == nil {
			refreshToken = existing.RefreshToken
		}
	}
	if refreshToken == "" {
		return errors.New("refresh token is required")
	}

	now := time.Now().Unix()
	_, err := s.db.ExecContext(ctx, `
INSERT INTO google_calendar_tokens (user_email, access_token, refresh_token, expiry, connectedAt, updated_at)
VALUES (?, ?, ?, ?, ?, ?)
ON CONFLICT(user_email) DO UPDATE SET
	access_token = excluded.access_token,
	refresh_token = excluded.refresh_token,
	expiry = excluded.expiry,
	updated_at = excluded.updated_at
`, userEmail, token.AccessToken, refreshToken, token.Expiry.Unix(), now, now)
	return err
}

func (s *Store) GetToken(ctx context.Context, userEmail string) (*oauth2.Token, error) {
	userEmail = normalizeEmail(userEmail)
	if userEmail == "" {
		return nil, errors.New("user email is required")
	}

	var token oauth2.Token
	var expiry int64
	err := s.db.QueryRowContext(ctx, `
SELECT access_token, refresh_token, expiry FROM google_calendar_tokens WHERE user_email = ?
`, userEmail).Scan(&token.AccessToken, &token.RefreshToken, &expiry)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("google calendar is not connected")
		}
		return nil, err
	}

	token.Expiry = time.Unix(expiry, 0)
	return &token, nil
}

func (s *Store) HasToken(ctx context.Context, userEmail string) (bool, error) {
	_, err := s.GetToken(ctx, userEmail)
	if err != nil {
		if strings.Contains(err.Error(), "not connected") {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

func normalizeEmail(value string) string {
	return strings.ToLower(strings.TrimSpace(value))
}
