package handlers

import (
	"net/http"
	"strings"

	"freelanceflow/internal/calendar"

	"github.com/gin-gonic/gin"
)

type CalendarHandler struct {
	service *calendar.Service
}

func NewCalendarHandler(service *calendar.Service) *CalendarHandler {
	return &CalendarHandler{service: service}
}

func (h *CalendarHandler) AuthGoogle(c *gin.Context) {
	authURL, err := h.service.AuthURL(c.Request.Context(), c.Query("userEmail"))
	if err != nil {
		c.JSON(http.StatusBadRequest, apiResponse{Message: err.Error()})
		return
	}

	c.Redirect(http.StatusTemporaryRedirect, authURL)
}

func (h *CalendarHandler) AuthGoogleCallback(c *gin.Context) {
	if errMessage := c.Query("error"); errMessage != "" {
		c.JSON(http.StatusBadRequest, apiResponse{Message: "google oauth denied: " + errMessage})
		return
	}

	if _, err := h.service.ExchangeCallback(c.Request.Context(), c.Query("code"), c.Query("state")); err != nil {
		c.JSON(http.StatusBadRequest, apiResponse{Message: err.Error()})
		return
	}

	c.Redirect(http.StatusTemporaryRedirect, h.service.ConnectedRedirectURL())
}

func (h *CalendarHandler) Status(c *gin.Context) {
	connected, err := h.service.IsConnected(c.Request.Context(), c.Query("userEmail"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, apiResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"connected": connected})
}

func (h *CalendarHandler) CreateEvent(c *gin.Context) {
	var req calendar.EventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, apiResponse{Message: "request body must be valid JSON"})
		return
	}

	result, err := h.service.CreateEvent(c.Request.Context(), req)
	if err != nil {
		status := http.StatusBadRequest
		if strings.Contains(err.Error(), "not connected") {
			status = http.StatusUnauthorized
		}
		c.JSON(status, apiResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "event created",
		"event":   result,
	})
}
