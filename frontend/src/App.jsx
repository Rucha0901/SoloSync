import { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home";
import CurrentProjects from "./pages/CurrentProjects";
import ClosedProjects from "./pages/ClosedProjects";
import Payments from "./pages/Payments";
import Invoices from "./pages/Invoices";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import "./App.css";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Redirect authenticated users trying to access login/signup
  const PublicRoute = ({ children }) => {
    return user ? <Navigate to="/" replace /> : children;
  };

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      {/* App Shell Routes (Protected) */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="app">
              <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

              <main className="app__content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/current-projects" element={<CurrentProjects />} />
                  <Route path="/closed-projects" element={<ClosedProjects />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
