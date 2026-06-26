import { useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
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
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import "./App.css";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const location = useLocation();

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
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
