package config

import "fmt"

type MissingEnvError struct {
	Vars []string
}

func (e *MissingEnvError) Error() string {
	return fmt.Sprintf("missing required environment variables: %v", e.Vars)
}
