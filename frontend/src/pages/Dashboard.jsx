import { useNavigate } from "react-router-dom";
import { FileText, Stethoscope, CalendarPlus, CalendarDays } from "lucide-react";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const navigate = useNavigate();
  
  // Safely decode the token to check the user's role
  const token = localStorage.getItem("token");
  let role = "patient"; // fallback
  if (token) {
    try {
      role = jwtDecode(token).role;
    } catch (e) {
      console.error("Invalid token");
    }
  }

  // Cards specific to Patients
  const patientCards = [
    { title: "My Records", icon: FileText, path: "/records", color: "bg-blue-50 text-blue-600" },
    { title: "Book Appointment", icon: CalendarPlus, path: "/book", color: "bg-purple-50 text-purple-600" },
    { title: "View Appointments", icon: CalendarDays, path: "/appointments", color: "bg-orange-50 text-orange-600" },
  ];

  // Cards specific to Doctors
  const doctorCards = [
    { title: "Patient Records", icon: FileText, path: "/records", color: "bg-blue-50 text-blue-600" },
    { title: "Add Prescription", icon: Stethoscope, path: "/prescription", color: "bg-emerald-50 text-emerald-600" },
    { title: "My Schedule", icon: CalendarDays, path: "/appointments", color: "bg-orange-50 text-orange-600" },
  ];

  const navCards = role === "doctor" ? doctorCards : patientCards;

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your healthcare operations and records.</p>
      </header>

      {/* Main Content Grid (No sidebar column here anymore!) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {navCards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 hover:-translate-y-1"
          >
            <div className={`inline-flex p-3 rounded-lg ${card.color} mb-4`}>
              <card.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
            <p className="mt-1 text-sm text-gray-500">Access and manage module</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;