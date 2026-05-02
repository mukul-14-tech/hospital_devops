import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { CalendarPlus, User, Calendar as CalendarIcon, Loader2 } from "lucide-react";

function BookAppointment() {
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/doctors", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(res.data);
      } catch (err) {
        toast.error("Failed to load doctors");
      } finally {
        setIsLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId || !date) {
      toast.error("Please select a doctor and date.");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/appointments/book",
        { doctorId, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Appointment booked successfully!");
      setDoctorId("");
      setDate("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error booking appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 animate-fade-in">
      <Toaster position="top-right" />
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-8 text-center border-b border-blue-100">
          <div className="mx-auto bg-blue-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <CalendarPlus className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-outfit font-bold text-slate-900">Schedule a Visit</h2>
          <p className="text-sm text-slate-600 mt-2">Book your next consultation securely.</p>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Doctor</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                {isLoadingDoctors ? (
                  <div className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 text-sm flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading doctors...
                  </div>
                ) : (
                  <select
                    required
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white"
                  >
                    <option value="" disabled>Choose a specialist...</option>
                    {doctors.map(doc => (
                      <option key={doc._id} value={doc._id}>Dr. {doc.name} ({doc.email})</option>
                    ))}
                  </select>
                )}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoadingDoctors}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-70 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-4"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;