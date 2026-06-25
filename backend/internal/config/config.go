package config

import "os"

type SMTPConfig struct {
	Host     string
	Port     string
	Username string
	Password string
	From     string
}

type Config struct {
	ServerPort string
	SMTP       SMTPConfig
}

// Load reads configuration from environment variables. SMTP credentials are
// never hardcoded; they must be supplied by the environment (e.g. via a
// process manager, container orchestrator, or a locally sourced .env file).
func Load() *Config {
	return &Config{
		ServerPort: getEnv("SERVER_PORT", "8080"),
		SMTP: SMTPConfig{
			Host:     os.Getenv("SMTP_HOST"),
			Port:     getEnv("SMTP_PORT", "587"),
			Username: os.Getenv("SMTP_USERNAME"),
			Password: os.Getenv("SMTP_PASSWORD"),
			From:     os.Getenv("SMTP_FROM"),
		},
	}
}

func (c *Config) ValidateSMTP() error {
	missing := []string{}

	if c.SMTP.Host == "" {
		missing = append(missing, "SMTP_HOST")
	}
	if c.SMTP.Username == "" {
		missing = append(missing, "SMTP_USERNAME")
	}
	if c.SMTP.Password == "" {
		missing = append(missing, "SMTP_PASSWORD")
	}
	if c.SMTP.From == "" {
		missing = append(missing, "SMTP_FROM")
	}

	if len(missing) > 0 {
		return &MissingEnvError{Vars: missing}
	}

	return nil
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
