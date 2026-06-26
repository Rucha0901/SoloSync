package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"freelanceflow/internal/config"
	"freelanceflow/internal/email"
	"freelanceflow/internal/handlers"
	"freelanceflow/internal/reminder"
	"freelanceflow/internal/router"
)

func main() {
	cfg := config.Load()

	if err := cfg.ValidateSMTP(); err != nil {
		log.Fatalf("configuration error: %v", err)
	}

	// Email service (SMTP)
	emailService := email.NewSMTPService(cfg.SMTP)
	emailHandler := handlers.NewEmailHandler(emailService)

	// Reminder service + scheduler (uses the same SMTP service)
	reminderSvc := reminder.NewService(emailService)
	scheduler := reminder.NewScheduler(reminderSvc)
	scheduler.Start()
	reminderHandler := handlers.NewReminderHandler(scheduler)

	r := router.New(emailHandler, reminderHandler)

	addr := ":" + cfg.ServerPort
	log.Printf("SoloSync backend listening on %s", addr)

	// Graceful shutdown on SIGINT / SIGTERM
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-quit
		log.Println("shutting down...")
		scheduler.Stop()
		os.Exit(0)
	}()

	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
