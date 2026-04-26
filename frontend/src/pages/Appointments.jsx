import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, User, Inbox, Loader2 } from "lucide-react";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/appointments/patient", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    if (s === 'confirmed' || s === 'approved') return "bg-green-100 text-green-800 border-green-200";
    if (s === 'cancelled') return "bg-red-100 text-red-800 border-red-200";
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-sm text-gray-500 mt-1">Track your upcoming and past consultations.</p>
      </div>

      {isFetching ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center bg-white border border-dashed border-gray-300 rounded-xl py-16 shadow-sm">
          <Inbox className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments scheduled</h3>
          <p className="mt-1 text-sm text-gray-500">You don't have any appointments booked yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appt) => (
            <div key={appt._id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${
                appt.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-400'
              }`}></div>
              
              <div className="flex justify-between items-start mb-4 pl-2">
                <div className="flex items-center space-x-2 text-gray-900 font-medium">
                  <User className="h-5 w-5 text-blue-500" />
                  <span>{appt.doctor?.name || "Unassigned Doctor"}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(appt.status)}`}>
                  {appt.status || 'Pending'}
                </span>
              </div>

              <div className="space-y-2 pl-2 border-t border-gray-50 pt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  {new Date(appt.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  {/* Assuming backend returns a time or standard date object */}
                  {new Date(appt.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Appointments;