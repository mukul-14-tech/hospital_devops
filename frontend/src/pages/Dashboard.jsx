import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Stethoscope, CalendarPlus, CalendarDays, TrendingUp, Users, Activity } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const THEME_CSS = `
  :root {
    --primary: #0d9488;
    --primary-light: #ccfbf1;
    --bg-light: #f8fafc;
    --bg-card: #ffffff;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --border: #e2e8f0;
    --radius-xl: 20px;
    --radius-lg: 16px;
    --shadow-sm: 0 2px 4px rgba(0,0,0,0.02);
    --shadow-md: 0 10px 25px -5px rgba(0,0,0,0.05);
  }

  .dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .dash-header {
    margin-bottom: 2.5rem;
    color: var(--text-main);
  }

  .role-badge {
    display: inline-block;
    padding: 0.35rem 0.85rem;
    background: var(--primary-light);
    color: var(--primary);
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 1rem;
  }

  .dash-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    letter-spacing: -0.5px;
  }

  .dash-header p {
    color: var(--text-muted);
    font-size: 1.1rem;
    max-width: 600px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.25rem;
    margin-bottom: 3rem;
  }

  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: var(--shadow-sm);
  }

  .stat-info p {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-muted);
    margin-bottom: 0.25rem;
  }

  .stat-info h4 {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-main);
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-main);
    margin-bottom: 1.5rem;
  }

  .nav-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .nav-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: var(--shadow-sm);
    position: relative;
    overflow: hidden;
  }

  .nav-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
    border-color: var(--primary);
  }

  .nav-icon-wrapper {
    width: 60px;
    height: 60px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    color: white;
  }

  .nav-card h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-main);
    margin-bottom: 0.5rem;
    transition: color 0.2s;
  }

  .nav-card p {
    color: var(--text-muted);
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .nav-footer {
    margin-top: 2rem;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-muted);
    transition: color 0.2s;
  }

  .nav-card:hover h3, .nav-card:hover .nav-footer {
    color: var(--primary);
  }

  /* Specific Icon Colors */
  .bg-blue { background: #3b82f6; }
  .bg-teal { background: #0d9488; }
  .bg-purple { background: #8b5cf6; }
  .bg-rose { background: #f43f5e; }
  
  .text-blue { color: #3b82f6; background: #eff6ff; }
  .text-teal { color: #0d9488; background: #f0fdfa; }
  .text-rose { color: #f43f5e; background: #fff1f2; }
  .text-purple { color: #8b5cf6; background: #f5f3ff; }
`;

function Dashboard() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = THEME_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
  const token = localStorage.getItem("token");
  let role = "patient"; 
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

  const patientCards = [
    { title: "My Records", description: "View your medical history and test results directly.", icon: FileText, path: "/records", bgClass: "bg-blue" },
    { title: "Book Appointment", description: "Schedule a visit with a specialist at your convenience.", icon: CalendarPlus, path: "/book", bgClass: "bg-teal" },
    { title: "View Appointments", description: "Check your upcoming consultations and reschedules.", icon: CalendarDays, path: "/appointments", bgClass: "bg-purple" },
  ];

  const doctorCards = [
    { title: "Patient Records", description: "Access detailed patient medical histories securely.", icon: FileText, path: "/records", bgClass: "bg-blue" },
    { title: "Add Prescription", description: "Issue new prescriptions to your assigned patients.", icon: Stethoscope, path: "/prescription", bgClass: "bg-teal" },
    { title: "My Schedule", description: "Manage your daily appointments and availability.", icon: CalendarDays, path: "/appointments", bgClass: "bg-rose" },
  ];

  const navCards = role === "doctor" ? doctorCards : patientCards;

  return (
    <div className="dashboard-container">
      <header className="dash-header">
        <div className="role-badge">
          {role === 'doctor' ? 'Clinical Dashboard' : 'Patient Portal'}
        </div>
        <h1>Welcome back, {userName}</h1>
        <p>Here's an overview of your healthcare operations and recent activity.</p>
      </header>

      <div className="stats-grid">
        {[
          { label: "Upcoming Appts", value: "3", icon: CalendarDays, colorClass: "text-blue" },
          { label: "Recent Records", value: "12", icon: FileText, colorClass: "text-teal" },
          { label: "Health Score", value: "94%", icon: Activity, colorClass: "text-rose" },
          { label: "Consultations", value: "28", icon: Users, colorClass: "text-purple" },
        ].map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-info">
              <p>{stat.label}</p>
              <h4>{stat.value}</h4>
            </div>
            <div className={`stat-icon ${stat.colorClass}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-title">Quick Actions</h2>

      <div className="nav-grid">
        {navCards.map((card, idx) => (
          <div key={card.title} onClick={() => navigate(card.path)} className="nav-card">
            <div className={`nav-icon-wrapper ${card.bgClass}`}>
              <card.icon size={26} />
            </div>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <div className="nav-footer">
              Open Module <TrendingUp size={16} style={{ marginLeft: '8px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;