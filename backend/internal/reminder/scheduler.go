package reminder

import (
	"context"
	"log"
	"time"
)

// DailyJob holds a snapshot of who to remind and for what projects.
// In a production system this would come from a database; here callers
// register snapshots via the HTTP handler and they are stored in memory.
type DailyJob struct {
	FreelancerEmail string
	Projects        []Project
}

// Scheduler fires CheckAndSend once per day for every registered job.
type Scheduler struct {
	svc  *Service
	jobs []DailyJob
	stop chan struct{}
}

func NewScheduler(svc *Service) *Scheduler {
	return &Scheduler{
		svc:  svc,
		stop: make(chan struct{}),
	}
}

// Register adds or replaces the job for a given freelancer email.
func (sc *Scheduler) Register(job DailyJob) {
	for i, j := range sc.jobs {
		if j.FreelancerEmail == job.FreelancerEmail {
			sc.jobs[i] = job
			return
		}
	}
	sc.jobs = append(sc.jobs, job)
}

// Start launches the daily tick loop in a background goroutine.
// It fires immediately on startup, then once every 24 hours.
func (sc *Scheduler) Start() {
	go func() {
		sc.run()
		ticker := time.NewTicker(24 * time.Hour)
		defer ticker.Stop()
		for {
			select {
			case <-ticker.C:
				sc.run()
			case <-sc.stop:
				log.Println("[reminder] scheduler stopped")
				return
			}
		}
	}()
	log.Println("[reminder] scheduler started — will check due dates every 24 hours")
}

// Stop signals the scheduler to exit gracefully.
func (sc *Scheduler) Stop() {
	close(sc.stop)
}

func (sc *Scheduler) run() {
	if len(sc.jobs) == 0 {
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	log.Printf("[reminder] running check for %d registered user(s)", len(sc.jobs))
	for _, job := range sc.jobs {
		errs := sc.svc.CheckAndSend(ctx, job.FreelancerEmail, job.Projects)
		for _, err := range errs {
			log.Printf("[reminder] error sending for %s: %v", job.FreelancerEmail, err)
		}
	}
}
