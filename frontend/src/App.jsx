import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Toaster } from "react-hot-toast";
import {
  LayoutDashboard, Users, CalendarPlus, CalendarDays,
  FileText, Stethoscope, Activity
} from "lucide-react";

import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import Records from "./pages/Records";
import AddPrescription from "./pages/AddPrescription";

const patientNav = [
  { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { name: "Book Appointment", path: "/book", icon: CalendarPlus },
  { name: "My Appointments", path: "/appointments", icon: CalendarDays },
  { name: "Medical Records", path: "/records", icon: FileText },
];

const doctorNav = [
  { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { name: "Schedule", path: "/appointments", icon: CalendarDays },
  { name: "Issue Prescription", path: "/prescription", icon: Stethoscope },
  { name: "Patient Records", path: "/records", icon: FileText },
];

const adminNav = [
  { name: "System Admin", path: "/admin", icon: Users },
  { name: "Activity Log", path: "/admin/activity", icon: Activity },
];

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" replace />;

  try {
    const decoded = jwtDecode(token);

    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      if (decoded.role === "admin") return <Navigate to="/admin" replace />;
      return <Navigate to="/dashboard" replace />;
    }

    const getNav = () => {
      if (decoded.role === "admin") return adminNav;
      if (decoded.role === "doctor") return doctorNav;
      return patientNav;
    };

    return (
      <DashboardLayout role={decoded.role} navigation={getNav()} userName={decoded.name}>
        {children}
      </DashboardLayout>
    );
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }
};

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#0f172a",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
          },
          success: { iconTheme: { primary: "#0d9488", secondary: "#ffffff" } },
          error: { iconTheme: { primary: "#e11d48", secondary: "#ffffff" } },
        }}
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["patient", "doctor"]}><Dashboard /></ProtectedRoute>} />
        <Route path="/book" element={<ProtectedRoute allowedRoles={["patient"]}><BookAppointment /></ProtectedRoute>} />
        <Route path="/prescription" element={<ProtectedRoute allowedRoles={["doctor"]}><AddPrescription /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute allowedRoles={["patient", "doctor"]}><Appointments /></ProtectedRoute>} />
        <Route path="/records" element={<ProtectedRoute allowedRoles={["patient", "doctor"]}><Records /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;