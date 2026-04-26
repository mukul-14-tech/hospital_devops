import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link2, Upload, FileText, UserCircle, Activity, Loader2, Inbox } from "lucide-react";

function Records() {
  const [records, setRecords] = useState([]);
  const [reportUrl, setReportUrl] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchRecords = useCallback(async () => {
    setIsFetching(true);
    try {
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
    if (!reportUrl) {
      toast.error("Please enter a valid report URL");
      return;
    }

    setIsUploading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/records/upload",
        { reportUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Report uploaded successfully!");
      setReportUrl("");
      fetchRecords();
    } catch (error) {
      toast.error("Failed to upload report.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      <Toaster position="top-right" />
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
        <p className="text-sm text-gray-500 mt-1">Upload and manage your clinical reports.</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Add New Record</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://example.com/report.pdf"
              value={reportUrl}
              onChange={(e) => setReportUrl(e.target.value)}
            />
          </div>
          <button
            onClick={uploadReport}
            disabled={isUploading}
            className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-colors"
          >
            {isUploading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Upload className="h-5 w-5 mr-2" />}
            Upload Report
          </button>
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Record History</h2>
        
        {isFetching ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl py-12">
            <Inbox className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No records found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by uploading a new report URL above.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {records.map((rec) => (
              <div key={rec._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]" title={rec.reportUrl}>
                        {rec.reportUrl.split('/').pop() || "Document"}
                      </p>
                      <a href={rec.reportUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                        View Original
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-50">
                  <div className="flex items-start text-sm">
                    <UserCircle className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
                    <span className="text-gray-600">Doctor: <span className="font-medium text-gray-900">{rec.doctor?.name || "Pending Assignment"}</span></span>
                  </div>
                  <div className="flex items-start text-sm">
                    <Activity className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
                    <div className="text-gray-600">
                      Prescription: 
                      {rec.prescription ? (
                        <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded border border-gray-100 text-xs">
                          {rec.prescription}
                        </p>
                      ) : (
                        <span className="ml-1 italic text-gray-400">Awaiting review</span>
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