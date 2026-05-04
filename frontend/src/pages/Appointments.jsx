import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, User, Inbox, Loader2, CheckCircle, XCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";

const THEME_CSS = `
  :root {
    --primary: #0d9488;
    --bg-light: #f8fafc;
    --bg-card: #ffffff;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --border: #e2e8f0;
    --radius-xl: 20px;
    --radius-lg: 16px;
    --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 10px 25px -5px rgba(0,0,0,0.05);
  }

  .page-container {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 0 1.5rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: fadeIn 0.4s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .page-header { margin-bottom: 2.5rem; }
  .page-title { font-size: 2.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem; letter-spacing: -0.5px; }
  .page-desc { color: var(--text-muted); font-size: 1rem; }

  .loading-state, .empty-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 4rem 2rem; background: var(--bg-card); border-radius: var(--radius-xl);
    border: 2px dashed var(--border); text-align: center;
  }
  .empty-icon { color: #cbd5e1; margin-bottom: 1rem; }
  .empty-state h3 { font-size: 1.1rem; color: var(--text-main); font-weight: 600; margin-bottom: 0.25rem; }
  .empty-state p { color: var(--text-muted); font-size: 0.9rem; }

  .appt-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;
  }

  .appt-card {
    background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border);
    padding: 1.5rem; position: relative; overflow: hidden; box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
  }
  .appt-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }

  .status-indicator { position: absolute; left: 0; top: 0; bottom: 0; width: 6px; }
  .status-indicator.confirmed { background: #10b981; }
  .status-indicator.cancelled { background: #ef4444; }
  .status-indicator.pending { background: #f59e0b; }

  .appt-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; padding-left: 0.5rem; }
  
  .person-info { display: flex; align-items: center; gap: 12px; }
  .person-avatar {
    width: 40px; height: 40px; border-radius: 12px; background: #f0fdfa;
    display: flex; align-items: center; justify-content: center; color: var(--primary);
  }
  .person-name { font-weight: 600; color: var(--text-main); font-size: 1rem; }

  .status-badge {
    padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .badge-confirmed { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
  .badge-cancelled { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
  .badge-pending { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }

  .appt-details { padding-left: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--bg-light); display: flex; flex-direction: column; gap: 0.75rem; }
  .detail-row { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; color: var(--text-muted); font-weight: 500; }
  .detail-icon { color: #94a3b8; }

  .action-buttons { display: flex; gap: 0.75rem; padding-left: 0.5rem; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--bg-light); }
  .btn-action {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 0.6rem; border-radius: 10px; font-size: 0.85rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s; border: none; font-family: inherit;
  }
  .btn-approve { background: #ecfdf5; color: #059669; }
  .btn-approve:hover { background: #d1fae5; }
  .btn-cancel { background: #fef2f2; color: #dc2626; }
  .btn-cancel:hover { background: #fee2e2; }
`;

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [role, setRole] = useState("patient");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = THEME_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    let userRole = "patient";
    try {
      userRole = jwtDecode(token).role;
      setRole(userRole);
    } catch (e) {
      console.error("Invalid token");
    }

    try {
      const endpoint = userRole === "doctor" 
        ? "http://localhost:5000/api/appointments/doctor"
        : "http://localhost:5000/api/appointments/patient";
        
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Appointment ${status} successfully`);
      fetchAppointments();
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const getStatusClass = (status) => {
    const s = status?.toLowerCase() || 'pending';
    if (s === 'confirmed' || s === 'approved') return "confirmed";
    if (s === 'cancelled') return "cancelled";
    return "pending";
  };

  return (
    <div className="page-container">
      <Toaster position="top-right" />
      <div className="page-header">
        <h1 className="page-title">{role === 'doctor' ? "Doctor Schedule" : "My Appointments"}</h1>
        <p className="page-desc">Track your upcoming and past consultations.</p>
      </div>

      {isFetching ? (
        <div className="loading-state">
          <Loader2 className="animate-spin" size={32} color="var(--primary)" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <Inbox className="empty-icon" size={48} />
          <h3>No appointments scheduled</h3>
          <p>You don't have any appointments booked yet.</p>
        </div>
      ) : (
        <div className="appt-grid">
          {appointments.map((appt) => {
            const statusClass = getStatusClass(appt.status);
            return (
              <div key={appt._id} className="appt-card">
                <div className={`status-indicator ${statusClass}`} />
                
                <div className="appt-header">
                  <div className="person-info">
                    <div className="person-avatar">
                      <User size={20} />
                    </div>
                    <span className="person-name">
                      {role === 'doctor' ? (appt.patient?.name || "Patient") : (appt.doctor?.name || "Doctor")}
                    </span>
                  </div>
                  <span className={`status-badge badge-${statusClass}`}>
                    {(appt.status || 'Pending')}
                  </span>
                </div>

                <div className="appt-details">
                  <div className="detail-row">
                    <Calendar className="detail-icon" size={16} />
                    {new Date(appt.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="detail-row">
                    <Clock className="detail-icon" size={16} />
                    {new Date(appt.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {role === 'doctor' && appt.status === 'pending' && (
                  <div className="action-buttons">
                    <button onClick={() => handleStatusUpdate(appt._id, 'confirmed')} className="btn-action btn-approve">
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button onClick={() => handleStatusUpdate(appt._id, 'cancelled')} className="btn-action btn-cancel">
                      <XCircle size={16} /> Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Appointments;