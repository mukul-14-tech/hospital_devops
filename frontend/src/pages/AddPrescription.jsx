import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FileText, Stethoscope, FilePlus2, Loader2, User } from "lucide-react";

function AddPrescription() {
  const [patientId, setPatientId] = useState("");
  const [prescription, setPrescription] = useState("");
  const [patients, setPatients] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/patients", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(res.data);
      } catch (err) {
        toast.error("Failed to load patients");
      } finally {
        setIsLoadingPatients(false);
      }
    };
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId || !prescription) {
      toast.error("Please fill in both fields.");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/records/prescription",
        { patientId, prescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Prescription added to patient records successfully!");
      setPatientId("");
      setPrescription("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving prescription");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 animate-fade-in">
      <Toaster position="top-right" />
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-8 border-b border-emerald-100 flex items-center space-x-4">
          <div className="bg-emerald-500 p-3 rounded-xl shadow-lg shadow-emerald-500/20">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-outfit font-bold text-slate-900">Clinical Prescription</h2>
            <p className="text-sm text-slate-600 mt-1">Issue new medical notes or prescriptions to a patient.</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Patient</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                {isLoadingPatients ? (
                  <div className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 text-sm flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading patients...
                  </div>
                ) : (
                  <select
                    required
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm appearance-none bg-white"
                  >
                    <option value="" disabled>Choose a patient...</option>
                    {patients.map(p => (
                      <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
                    ))}
                  </select>
                )}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Prescription / Notes</label>
              <textarea
                required
                rows={5}
                placeholder="e.g., Take Amoxicillin 500mg twice daily for 7 days..."
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                className="block w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 sm:text-sm resize-y bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoadingPatients}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-70 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-4"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <FilePlus2 className="h-5 w-5 mr-2" />
                  Issue Prescription
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPrescription;