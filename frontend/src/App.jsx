import { useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import CurrentProjects from "./pages/CurrentProjects";
import ClosedProjects from "./pages/ClosedProjects";
import DeadlineSchedule from "./pages/DeadlineSchedule";
import PaymentDashboard from "./pages/PaymentDashboard";
import Invoices from "./pages/Invoices";
import Login from "./pages/Login";
import MeetSchedule from "./pages/MeetSchedule";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Reminders from "./pages/Reminders";
import NewProjectModal from "./components/NewProjectModal/NewProjectModal";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { registerReminders, alreadyRegisteredThisSession } from "./services/ReminderService";
import { addProject } from "./services/scheduleService";
import "./App.css";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { user } = useAuth();
  const location = useLocation();

  // Register this user's projects with the backend reminder scheduler
  // whenever they log in (or the page is refreshed while logged in).
  useEffect(() => {
    if (user && !alreadyRegisteredThisSession()) {
      registerReminders(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setSuccessMessage(""), 3500);
    return () => window.clearTimeout(timeout);
  }, [successMessage]);

  const handleCreateProject = (project) => {
    const createdProject = addProject(project);
    setIsProjectModalOpen(false);
    setSuccessMessage(`${createdProject.name} was created successfully.`);
  };

  // Redirect authenticated users trying to access login/signup
  const PublicRoute = ({ children }) => {
    return user ? <Navigate to="/dashboard" replace /> : children;
  };

  const renderAppShell = (children) => (
    <ProtectedRoute>
      <div className="app">
        <Navbar
          onMenuClick={() => setIsSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewProjectClick={() => setIsProjectModalOpen(true)}
        />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {successMessage && (
          <div className="app__success-toast" role="status">
            {successMessage}
          </div>
        )}

        <main className="app__content">{children}</main>

        <NewProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          onCreate={handleCreateProject}
        />
      </div>
    </ProtectedRoute>
  );

  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Landing />} />

      {/* Auth Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/payments" element={renderAppShell(<PaymentDashboard />)} />
      <Route path="/current-projects" element={renderAppShell(<CurrentProjects searchQuery={searchQuery} />)} />
      <Route path="/closed-projects" element={renderAppShell(<ClosedProjects searchQuery={searchQuery} />)} />

      {/* App Shell Routes (Protected) */}
      <Route
        path="/dashboard/*"
        element={renderAppShell(
            <Routes>
              <Route path="/" element={<Home onNewProjectClick={() => setIsProjectModalOpen(true)} />} />
              <Route path="current-projects" element={<CurrentProjects searchQuery={searchQuery} />} />
              <Route path="closed-projects" element={<ClosedProjects searchQuery={searchQuery} />} />
              <Route path="meet-schedule" element={<MeetSchedule />} />
              <Route path="deadline-schedule" element={<DeadlineSchedule />} />
              <Route path="payments" element={<PaymentDashboard />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="profile" element={<Profile />} />
              <Route path="reminders" element={<Reminders />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        )}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
