package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"freelanceflow/internal/calendar"
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
	if err := cfg.ValidateGoogle(); err != nil {
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

	calendarStore, err := calendar.NewStore(cfg.Database.Path)
	if err != nil {
		log.Fatalf("calendar database error: %v", err)
	}
	defer calendarStore.Close()

	calendarService, err := calendar.NewService(calendarStore, cfg.Google)
	if err != nil {
		log.Fatalf("calendar configuration error: %v", err)
	}
	calendarHandler := handlers.NewCalendarHandler(calendarService)

	r := router.New(emailHandler, reminderHandler, calendarHandler)

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
