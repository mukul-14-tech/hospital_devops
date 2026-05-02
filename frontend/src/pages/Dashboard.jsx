import { useNavigate } from "react-router-dom";
import { FileText, Stethoscope, CalendarPlus, CalendarDays, TrendingUp, Users, Activity } from "lucide-react";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const navigate = useNavigate();
  
  // Safely decode the token to check the user's role
  const token = localStorage.getItem("token");
  let role = "patient"; // fallback
  let userName = "User";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
      userName = decoded.name || (role === 'doctor' ? 'Dr. Smith' : 'Patient');
    } catch (e) {
      console.error("Invalid token");
    }
  }

  // Cards specific to Patients
  const patientCards = [
    { title: "My Records", description: "View your medical history and test results", icon: FileText, path: "/records", gradient: "from-blue-500 to-cyan-400", shadow: "shadow-blue-500/20" },
    { title: "Book Appointment", description: "Schedule a visit with a specialist", icon: CalendarPlus, path: "/book", gradient: "from-rose-500 to-orange-400", shadow: "shadow-rose-500/20" },
    { title: "View Appointments", description: "Check your upcoming consultations", icon: CalendarDays, path: "/appointments", gradient: "from-purple-500 to-indigo-400", shadow: "shadow-purple-500/20" },
  ];

  // Cards specific to Doctors
  const doctorCards = [
    { title: "Patient Records", description: "Access detailed patient medical histories", icon: FileText, path: "/records", gradient: "from-blue-500 to-cyan-400", shadow: "shadow-blue-500/20" },
    { title: "Add Prescription", description: "Issue new prescriptions to patients", icon: Stethoscope, path: "/prescription", gradient: "from-emerald-500 to-teal-400", shadow: "shadow-emerald-500/20" },
    { title: "My Schedule", description: "Manage your daily appointments", icon: CalendarDays, path: "/appointments", gradient: "from-rose-500 to-orange-400", shadow: "shadow-rose-500/20" },
  ];

  const navCards = role === "doctor" ? doctorCards : patientCards;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <header className="mb-10 text-white">
        <div className="flex items-center space-x-2 mb-2">
          <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium backdrop-blur-sm">
            {role === 'doctor' ? 'Clinical Dashboard' : 'Patient Portal'}
          </div>
        </div>
        <h1 className="text-4xl font-outfit font-bold">
          Welcome back, {userName}
        </h1>
        <p className="mt-2 text-slate-300 max-w-xl">
          Here's an overview of your healthcare operations and recent activity.
        </p>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { label: "Upcoming Appts", value: "3", icon: CalendarDays, color: "text-blue-500" },
          { label: "Recent Records", value: "12", icon: FileText, color: "text-emerald-500" },
          { label: "Health Score", value: "94%", icon: Activity, color: "text-rose-500" },
          { label: "Consultations", value: "28", icon: Users, color: "text-purple-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h4 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h4>
            </div>
            <div className={`h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6 mt-12">
        <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {navCards.map((card, idx) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            className="group relative bg-white rounded-2xl p-1 shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300 z-0 pointer-events-none" />
            
            <div className="relative bg-white rounded-xl p-6 h-full border border-slate-100 z-10">
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.gradient} mb-5 shadow-lg ${card.shadow}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-outfit font-bold text-slate-900 group-hover:text-rose-600 transition-colors">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{card.description}</p>
              
              <div className="mt-6 flex items-center text-sm font-medium text-slate-400 group-hover:text-rose-500 transition-colors">
                Open Module
                <TrendingUp className="ml-2 h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;