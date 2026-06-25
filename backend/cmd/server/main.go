package main

import (
	"log"
	"net/http"

	"freelanceflow/internal/config"
	"freelanceflow/internal/email"
	"freelanceflow/internal/handlers"
	"freelanceflow/internal/router"
)

func main() {
	cfg := config.Load()

	if err := cfg.ValidateSMTP(); err != nil {
		log.Fatalf("configuration error: %v", err)
	}

	emailService := email.NewSMTPService(cfg.SMTP)
	emailHandler := handlers.NewEmailHandler(emailService)

	r := router.New(emailHandler)

	addr := ":" + cfg.ServerPort
	log.Printf("SoloSync backend listening on %s", addr)

	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
