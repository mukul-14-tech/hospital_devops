import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Toaster } from "react-hot-toast";
import { LayoutDashboard, Users, CalendarPlus, CalendarDays, FileText, Stethoscope } from "lucide-react";

// Layouts
import DashboardLayout from "./components/DashboardLayout";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import Records from "./pages/Records";
import AddPrescription from "./pages/AddPrescription";

// --- Navigation Configurations for the Sidebar ---
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
];

// --- Protected Route Wrapper ---
// This component checks if the user is logged in, validates their role, 
// and automatically wraps the page in the SaaS sidebar layout.
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  try {
    const decoded = jwtDecode(token);
    
    // Check if user has permission to view this route
    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      // Redirect to their correct home page based on role
      if (decoded.role === "admin") return <Navigate to="/admin" replace />;
      return <Navigate to="/dashboard" replace />;
    }
    
    // Determine which sidebar navigation to show based on role
    const getNav = () => {
      if (decoded.role === 'admin') return adminNav;
      if (decoded.role === 'doctor') return doctorNav;
      return patientNav;
    };

    return (
      <DashboardLayout role={decoded.role} navigation={getNav()}>
        {children}
      </DashboardLayout>
    );
  } catch (error) {
    // If token is invalid or malformed, clear it and force re-login
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* --- Public Auth Routes --- */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Admin Routes --- */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* --- Shared Dashboard Route (Patient & Doctor) --- */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['patient', 'doctor']}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* --- Patient Only Routes --- */}
        <Route 
          path="/book" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <BookAppointment />
            </ProtectedRoute>
          } 
        />
        
        {/* --- Doctor Only Routes --- */}
        <Route 
          path="/prescription" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <AddPrescription />
            </ProtectedRoute>
          } 
        />

        {/* --- Shared Feature Routes (Patient & Doctor) --- */}
        <Route 
          path="/appointments" 
          element={
            <ProtectedRoute allowedRoles={['patient', 'doctor']}>
              <Appointments />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/records" 
          element={
            <ProtectedRoute allowedRoles={['patient', 'doctor']}>
              <Records />
            </ProtectedRoute>
          } 
        />
        
        {/* --- Fallback Route (404 handling) --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;