import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FileText, Stethoscope, FilePlus2, Loader2 } from "lucide-react";

function AddPrescription() {
  const [recordId, setRecordId] = useState("");
  const [prescription, setPrescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recordId || !prescription) {
      toast.error("Please fill in both fields.");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/records/prescription",
        { recordId, prescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Prescription appended to record successfully!");
      setRecordId("");
      setPrescription("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving prescription");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8">
      <Toaster position="top-right" />
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-emerald-50 px-6 py-6 border-b border-emerald-100 flex items-center space-x-4">
          <div className="bg-emerald-100 p-3 rounded-lg">
            <Stethoscope className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Clinical Prescription</h2>
            <p className="text-sm text-gray-600">Append medical notes to an existing patient record.</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medical Record ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Paste the Record ID"
                  value={recordId}
                  onChange={(e) => setRecordId(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prescription / Notes</label>
              <textarea
                required
                rows={5}
                placeholder="e.g., Take Amoxicillin 500mg twice daily for 7 days..."
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 sm:text-sm resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <FilePlus2 className="h-5 w-5 mr-2" />
                  Save to Record
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