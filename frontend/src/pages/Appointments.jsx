import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, User, Inbox, Loader2, CheckCircle, XCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [role, setRole] = useState("patient");

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

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    if (s === 'confirmed' || s === 'approved') return "bg-green-100 text-green-800 border-green-200";
    if (s === 'cancelled') return "bg-red-100 text-red-800 border-red-200";
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 animate-fade-in">
      <Toaster position="top-right" />
      <div className="mb-8">
        <h1 className="text-3xl font-outfit font-bold text-slate-900">
          {role === 'doctor' ? "Doctor Schedule" : "My Appointments"}
        </h1>
        <p className="text-sm text-slate-500 mt-2">Track your upcoming and past consultations.</p>
      </div>

      {isFetching ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center bg-white border border-dashed border-slate-300 rounded-2xl py-16 shadow-sm">
          <Inbox className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-sm font-medium text-slate-900">No appointments scheduled</h3>
          <p className="mt-1 text-sm text-slate-500">You don't have any appointments booked yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appt) => (
            <div key={appt._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all p-5 relative overflow-hidden group hover:-translate-y-1">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${
                (appt.status === 'confirmed' || appt.status === 'approved') ? 'bg-emerald-500' : appt.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-400'
              }`}></div>
              
              <div className="flex justify-between items-start mb-4 pl-3">
                <div className="flex items-center space-x-3 text-slate-900 font-medium">
                  <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-500" />
                  </div>
                  <span>{role === 'doctor' ? (appt.patient?.name || "Patient") : (appt.doctor?.name || "Doctor")}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(appt.status)}`}>
                  {(appt.status || 'Pending').toUpperCase()}
                </span>
              </div>

              <div className="space-y-3 pl-3 border-t border-slate-50 pt-4">
                <div className="flex items-center text-sm text-slate-600 font-medium">
                  <Calendar className="h-4 w-4 mr-3 text-slate-400" />
                  {new Date(appt.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
                <div className="flex items-center text-sm text-slate-600 font-medium">
                  <Clock className="h-4 w-4 mr-3 text-slate-400" />
                  {new Date(appt.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {role === 'doctor' && appt.status === 'pending' && (
                <div className="mt-5 pl-3 flex space-x-2 border-t border-slate-50 pt-4">
                  <button 
                    onClick={() => handleStatusUpdate(appt._id, 'confirmed')}
                    className="flex-1 flex items-center justify-center py-2 px-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mr-1.5" /> Approve
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(appt._id, 'cancelled')}
                    className="flex-1 flex items-center justify-center py-2 px-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <XCircle className="h-4 w-4 mr-1.5" /> Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Appointments;