import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Users, Stethoscope, Calendar, UserPlus, Mail, Lock, Shield, Loader2 } from "lucide-react";

const THEME_CSS = `
  :root {
    --primary: #3b82f6; 
    --primary-hover: #2563eb;
    --bg-light: #f8fafc;
    --bg-card: #ffffff;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --border: #e2e8f0;
    --radius-xl: 16px;
    --radius-md: 10px;
    --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }

  .admin-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1.5rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: fadeIn 0.4s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .admin-header { margin-bottom: 2rem; }
  .admin-title { font-size: 2rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem; }
  .admin-desc { color: var(--text-muted); font-size: 0.95rem; }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }

  .stat-card {
    background: var(--bg-card);
    border-radius: var(--radius-xl);
    border: 1px solid var(--border);
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    box-shadow: var(--shadow-sm);
  }

  .stat-icon {
    width: 50px; height: 50px;
    border-radius: var(--radius-md);
    display: flex; align-items: center; justify-content: center;
  }
  .stat-info p { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.25rem; }
  .stat-info h3 { font-size: 1.5rem; font-weight: 700; color: var(--text-main); }

  .bg-blue { background: #eff6ff; color: #2563eb; }
  .bg-emerald { background: #ecfdf5; color: #059669; }
  .bg-purple { background: #f3e8ff; color: #7e22ce; }

  .admin-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  @media (min-width: 1024px) {
    .admin-layout { grid-template-columns: 1fr 2fr; }
  }

  .panel-card {
    background: var(--bg-card);
    border-radius: var(--radius-xl);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  .panel-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border);
    background: var(--bg-light);
    display: flex; align-items: center; gap: 10px;
  }
  .panel-title { font-size: 1.1rem; font-weight: 600; color: var(--text-main); display: flex; align-items: center; gap: 8px; }

  .panel-body { padding: 1.5rem; }

  .input-wrapper { position: relative; margin-bottom: 1rem; }
  .input-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
  .form-control {
    width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1.5px solid var(--border); border-radius: var(--radius-md);
    font-family: inherit; font-size: 0.9rem; color: var(--text-main); transition: all 0.2s ease;
  }
  .form-control:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }

  .btn-submit {
    width: 100%; padding: 0.85rem; background: var(--primary); color: white;
    border: none; border-radius: var(--radius-md); font-size: 0.95rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s; display: flex; justify-content: center; align-items: center;
  }
  .btn-submit:hover:not(:disabled) { background: var(--primary-hover); transform: translateY(-1px); }
  .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

  .custom-table { width: 100%; border-collapse: collapse; text-align: left; }
  .custom-table th {
    padding: 1rem 1.5rem; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
    color: var(--text-muted); border-bottom: 1px solid var(--border);
  }
  .custom-table td {
    padding: 1rem 1.5rem; border-bottom: 1px solid var(--border);
    font-size: 0.9rem; color: var(--text-main); font-weight: 500;
  }
  .custom-table tr:hover td { background: var(--bg-light); }
  .custom-table tr:last-child td { border-bottom: none; }

  .role-badge {
    padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: capitalize;
  }
  .role-admin { background: #f3e8ff; color: #7e22ce; border: 1px solid #e9d5ff; }
  .role-doctor { background: #ecfdf5; color: #059669; border: 1px solid #d1fae5; }
  .role-patient { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }

  .id-text { color: var(--text-muted); font-family: monospace; font-size: 0.8rem; }
`;

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ users: 0, appointments: 0, doctors: 0 });
  const [doctor, setDoctor] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = THEME_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setIsFetching(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addDoctor = async (e) => {
    e.preventDefault();
    if (!doctor.name || !doctor.email || !doctor.password) {
      toast.error("Please fill all doctor fields");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/admin/doctor", doctor, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Doctor added successfully");
      setDoctor({ name: "", email: "", password: "" });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add doctor");
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { title: "Total Users", value: stats.users || stats.totalUsers || 0, icon: Users, bgClass: "bg-blue" },
    { title: "Total Doctors", value: stats.doctors || stats.totalDoctors || 0, icon: Stethoscope, bgClass: "bg-emerald" },
    { title: "Appointments", value: stats.appointments || stats.totalAppointments || 0, icon: Calendar, bgClass: "bg-purple" },
  ];

  return (
    <div className="admin-container">
      <Toaster position="top-right" />
      
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <p className="admin-desc">System overview and user management.</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className={`stat-icon ${stat.bgClass}`}>
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <p>{stat.title}</p>
              <h3>{isFetching ? "-" : stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-layout">
        
        {/* Add Doctor Panel */}
        <div className="panel-card">
          <div className="panel-header">
            <h2 className="panel-title"><UserPlus size={20} color="var(--primary)" /> Add New Doctor</h2>
          </div>
          <div className="panel-body">
            <form onSubmit={addDoctor}>
              <div className="input-wrapper">
                <Stethoscope className="input-icon" size={16} />
                <input
                  type="text"
                  placeholder="Doctor Name"
                  value={doctor.name}
                  onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="input-wrapper">
                <Mail className="input-icon" size={16} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={doctor.email}
                  onChange={(e) => setDoctor({ ...doctor, email: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="input-wrapper">
                <Lock className="input-icon" size={16} />
                <input
                  type="password"
                  placeholder="Temporary Password"
                  value={doctor.password}
                  onChange={(e) => setDoctor({ ...doctor, password: e.target.value })}
                  className="form-control"
                />
              </div>
              <button type="submit" disabled={isLoading} className="btn-submit">
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Provision Account"}
              </button>
            </form>
          </div>
        </div>

        {/* Users Table Panel */}
        <div className="panel-card">
          <div className="panel-header">
            <h2 className="panel-title"><Shield size={20} color="var(--text-muted)" /> System Users</h2>
          </div>
          
          {isFetching ? (
            <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
              <Loader2 className="animate-spin" size={28} color="var(--primary)" />
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>
                        <span className={`role-badge role-${u.role}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="id-text">{u._id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;