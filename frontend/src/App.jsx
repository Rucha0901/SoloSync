import { useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import UpcomingMeetPanel from "./components/UpcomingMeetPanel/UpcomingMeetPanel";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import CurrentProjects from "./pages/CurrentProjects";
import ClosedProjects from "./pages/ClosedProjects";
import DeadlineSchedule from "./pages/DeadlineSchedule";
import Payments from "./pages/Payments";
import Invoices from "./pages/Invoices";
import Login from "./pages/Login";
import MeetSchedule from "./pages/MeetSchedule";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Reminders from "./pages/Reminders";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { registerReminders, alreadyRegisteredThisSession } from "./services/ReminderService";
import "./App.css";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const location = useLocation();

  // Register this user's projects with the backend reminder scheduler
  // whenever they log in (or the page is refreshed while logged in).
  useEffect(() => {
    if (user && !alreadyRegisteredThisSession()) {
      registerReminders(user.email);
    }
  }, [user]);

  // Redirect authenticated users trying to access login/signup
  const PublicRoute = ({ children }) => {
    return user ? <Navigate to="/dashboard" replace /> : children;
  };

  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Landing />} />

      {/* Auth Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      {/* App Shell Routes (Protected) */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <div className="app">
              <Navbar
                onMenuClick={() => setIsSidebarOpen(true)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

              <div className="app__body">
                <main className="app__content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/current-projects" element={<CurrentProjects searchQuery={searchQuery} />} />
                    <Route path="/closed-projects" element={<ClosedProjects searchQuery={searchQuery} />} />
                    <Route path="/meet-schedule" element={<MeetSchedule />} />
                    <Route path="/deadline-schedule" element={<DeadlineSchedule />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/reminders" element={<Reminders />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </main>
                <UpcomingMeetPanel />
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
