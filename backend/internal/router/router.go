package router

import (
	"net/http"

	"freelanceflow/internal/handlers"
)

func New(emailHandler *handlers.EmailHandler) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /api/email/send", emailHandler.SendEmail)
	mux.HandleFunc("GET /api/health", healthCheck)

	return withCORS(mux)
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"ok"}`))
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
