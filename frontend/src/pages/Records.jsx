import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link2, Upload, FileText, UserCircle, Activity, Loader2, Inbox } from "lucide-react";
import { jwtDecode } from "jwt-decode";

function Records() {
  const [records, setRecords] = useState([]);
  const [file, setFile] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [role, setRole] = useState("patient");

  const token = localStorage.getItem("token");

  const fetchRecords = useCallback(async () => {
    setIsFetching(true);
    try {
      if (token) {
        setRole(jwtDecode(token).role);
      }
      const res = await axios.get("http://localhost:5000/api/records/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data);
    } catch (error) {
      toast.error("Failed to fetch records.");
    } finally {
      setIsFetching(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const uploadReport = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(
        "http://localhost:5000/api/records/upload",
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" 
          } 
        }
      );
      toast.success("Report uploaded successfully!");
      setFile(null);
      document.getElementById("fileUpload").value = "";
      fetchRecords();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload report.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 animate-fade-in">
      <Toaster position="top-right" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-outfit font-bold text-slate-900">Medical Records</h1>
        <p className="text-sm text-slate-500 mt-2">
          {role === 'doctor' ? "Review patient records and prescriptions." : "Upload and manage your clinical reports."}
        </p>
      </div>

      {/* Upload Section (Only for patients) */}
      {role === 'patient' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8">
          <h2 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Add New Record</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="fileUpload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="block w-full pl-11 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-slate-50 focus:bg-white transition-colors text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <button
              onClick={uploadReport}
              disabled={isUploading || !file}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all shadow-md hover:shadow-lg"
            >
              {isUploading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Upload className="h-5 w-5 mr-2" />}
              Upload Report
            </button>
          </div>
        </div>
      )}

      {/* Records List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Record History</h2>
        
        {isFetching ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center bg-white border border-dashed border-slate-300 rounded-2xl py-12 shadow-sm">
            <Inbox className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-sm font-medium text-slate-900">No records found</h3>
            <p className="mt-1 text-sm text-slate-500">
              {role === 'doctor' ? "No records available for your patients." : "Get started by uploading a new report URL above."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {records.map((rec) => (
              <div key={rec._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:scale-105 transition-transform">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px]" title={rec.reportUrl || "Prescription Record"}>
                        {rec.reportUrl ? (rec.reportUrl.split('/').pop() || "Document") : "Prescription Record"}
                      </p>
                      {rec.reportUrl && (
                        <a href={rec.reportUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline">
                          View Original Report
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-5 border-t border-slate-50">
                  <div className="flex items-start text-sm">
                    <UserCircle className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
                    <span className="text-slate-600">
                      {role === 'doctor' ? "Patient: " : "Doctor: "} 
                      <span className="font-semibold text-slate-900">
                        {role === 'doctor' 
                          ? (rec.patient?.name || "Unknown Patient") 
                          : (rec.doctor?.name || "Pending Assignment")}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-start text-sm">
                    <Activity className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
                    <div className="text-slate-600 w-full">
                      Prescription: 
                      {rec.prescription ? (
                        <div className="mt-2 text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm leading-relaxed">
                          {rec.prescription}
                        </div>
                      ) : (
                        <span className="ml-2 italic text-slate-400 font-medium">Awaiting review</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Records;