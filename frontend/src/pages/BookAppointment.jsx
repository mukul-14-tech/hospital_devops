import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { CalendarPlus, Hash, Calendar as CalendarIcon, Loader2 } from "lucide-react";

function BookAppointment() {
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId || !date) {
      toast.error("Please provide both Doctor ID and Date.");
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
    <div className="max-w-2xl mx-auto p-6 md:p-8">
      <Toaster position="top-right" />
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-50 px-6 py-8 text-center border-b border-blue-100">
          <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <CalendarPlus className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Schedule a Visit</h2>
          <p className="text-sm text-gray-600 mt-1">Book your next consultation securely.</p>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Doctor ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Paste the Doctor's exact system ID"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">You can obtain this from the clinic or admin dashboard.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all"
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