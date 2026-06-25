import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import CurrentProjects from "./pages/CurrentProjects";
import ClosedProjects from "./pages/ClosedProjects";
import Payments from "./pages/Payments";
import Invoices from "./pages/Invoices";
import "./App.css";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="app__content">
        <Routes>
          <Route path="/" element={<Navigate to="/current-projects" replace />} />
          <Route path="/current-projects" element={<CurrentProjects />} />
          <Route path="/closed-projects" element={<ClosedProjects />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/invoices" element={<Invoices />} />
        </Routes>
      </main>
    </div>
  );
}
