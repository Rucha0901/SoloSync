package router

import (
	"net/http"

	"freelanceflow/internal/handlers"

	"github.com/gin-gonic/gin"
)

func New(emailHandler *handlers.EmailHandler, reminderHandler *handlers.ReminderHandler, calendarHandler *handlers.CalendarHandler) http.Handler {
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery(), corsMiddleware())

	// Email routes
	r.POST("/api/email/send", gin.WrapF(emailHandler.SendEmail))
	mux.HandleFunc("POST /api/email/send", emailHandler.SendEmail)
	mux.HandleFunc("POST /api/email/welcome-client", emailHandler.SendWelcomeEmail)
	mux.HandleFunc("POST /api/email/thank-you-client", emailHandler.SendThankYouEmail)

	// Reminder routes
	r.POST("/api/reminders/register", gin.WrapF(reminderHandler.Register))
	r.POST("/api/reminders/trigger-now", gin.WrapF(reminderHandler.TriggerNow))

	// Google Calendar routes
	r.GET("/auth/google", calendarHandler.AuthGoogle)
	r.GET("/auth/google/callback", calendarHandler.AuthGoogleCallback)
	r.GET("/calendar/status", calendarHandler.Status)
	r.POST("/calendar/create-event", calendarHandler.CreateEvent)

	// Health
	r.GET("/api/health", healthCheck)

	return r
}

func healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
