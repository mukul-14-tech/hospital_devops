import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Upload, FileText, UserCircle, Activity, Loader2, Inbox, ExternalLink } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const THEME_CSS = `
  :root {
    --primary: #0d9488;
    --primary-hover: #0f766e;
    --bg-light: #f8fafc;
    --bg-card: #ffffff;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --border: #e2e8f0;
    --radius-xl: 20px;
    --radius-lg: 16px;
    --radius-md: 12px;
    --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 10px 25px -5px rgba(0,0,0,0.05);
  }

  .page-container { max-width: 1000px; margin: 2rem auto; padding: 0 1.5rem; font-family: 'Plus Jakarta Sans', sans-serif; animation: fadeIn 0.4s ease-out; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  .page-header { margin-bottom: 2.5rem; }
  .page-title { font-size: 2.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem; letter-spacing: -0.5px; }
  .page-desc { color: var(--text-muted); font-size: 1rem; }

  .upload-card {
    background: var(--bg-card); padding: 1.75rem; border-radius: var(--radius-xl); border: 1px solid var(--border);
    box-shadow: var(--shadow-sm); margin-bottom: 2.5rem;
  }
  .upload-title { font-size: 0.85rem; font-weight: 700; color: var(--text-main); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1rem; }
  
  .upload-controls { display: flex; gap: 1rem; flex-wrap: wrap; }
  .file-input-wrapper { flex: 1; position: relative; min-width: 250px; }
  .file-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
  
  .custom-file-input {
    width: 100%; padding: 0.75rem 1rem 0.75rem 2.75rem; border: 1.5px solid var(--border); border-radius: var(--radius-md);
    background: var(--bg-light); color: var(--text-muted); font-family: inherit; font-size: 0.9rem; transition: all 0.2s;
  }
  .custom-file-input:focus { outline: none; border-color: var(--primary); background: white; }
  .custom-file-input::file-selector-button {
    background: #e0f2fe; color: #0284c7; border: none; padding: 0.4rem 1rem; border-radius: 20px; font-weight: 600; font-size: 0.85rem; cursor: pointer; margin-right: 1rem; transition: background 0.2s;
  }
  .custom-file-input::file-selector-button:hover { background: #bae6fd; }

  .btn-upload {
    display: inline-flex; items-align: center; justify-content: center; gap: 8px; padding: 0.75rem 1.5rem;
    background: var(--text-main); color: white; border: none; border-radius: var(--radius-md); font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit;
  }
  .btn-upload:hover:not(:disabled) { background: #000; transform: translateY(-2px); box-shadow: var(--shadow-md); }
  .btn-upload:disabled { opacity: 0.7; cursor: not-allowed; }

  .section-title { font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 1.5rem; }

  .loading-state, .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; background: var(--bg-card); border-radius: var(--radius-xl); border: 2px dashed var(--border); text-align: center; }
  .empty-icon { color: #cbd5e1; margin-bottom: 1rem; }
  .empty-state h3 { font-size: 1.1rem; color: var(--text-main); font-weight: 600; margin-bottom: 0.25rem; }
  .empty-state p { color: var(--text-muted); font-size: 0.9rem; }

  .records-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }

  .record-card {
    background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border);
    padding: 1.5rem; box-shadow: var(--shadow-sm); transition: all 0.3s ease; display: flex; flex-direction: column;
  }
  .record-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: #cbd5e1; }

  .record-header { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.5rem; }
  .doc-icon-wrapper { padding: 0.75rem; background: #f0fdfa; border-radius: 12px; color: var(--primary); }
  .doc-info { overflow: hidden; }
  .doc-name { font-size: 1rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .doc-link { display: inline-flex; align-items: center; gap: 4px; font-size: 0.8rem; font-weight: 600; color: var(--primary); text-decoration: none; transition: opacity 0.2s; }
  .doc-link:hover { opacity: 0.8; text-decoration: underline; }

  .record-details { padding-top: 1.25rem; border-top: 1px solid var(--bg-light); display: flex; flex-direction: column; gap: 1rem; flex: 1; }
  
  .detail-row { display: flex; align-items: flex-start; gap: 12px; font-size: 0.9rem; color: var(--text-muted); }
  .detail-icon { color: #94a3b8; flex-shrink: 0; margin-top: 2px; }
  
  .prescription-box {
    margin-top: 0.5rem; padding: 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;
    color: var(--text-main); font-size: 0.9rem; line-height: 1.5; font-family: inherit;
  }
  .status-italic { font-style: italic; color: #94a3b8; font-weight: 500; }
`;

function Records() {
  const [records, setRecords] = useState([]);
  const [file, setFile] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [role, setRole] = useState("patient");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = THEME_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const fetchRecords = useCallback(async () => {
    setIsFetching(true);
    try {
      if (token) setRole(jwtDecode(token).role);
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
    if (!file) return toast.error("Please select a file to upload");

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(
        "http://localhost:5000/api/records/upload",
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
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
    <div className="page-container">
      <Toaster position="top-right" />
      
      <div className="page-header">
        <h1 className="page-title">Medical Records</h1>
        <p className="page-desc">
          {role === 'doctor' ? "Review patient records and prescriptions." : "Upload and manage your clinical reports."}
        </p>
      </div>

      {role === 'patient' && (
        <div className="upload-card">
          <h2 className="upload-title">Add New Record</h2>
          <div className="upload-controls">
            <div className="file-input-wrapper">
              <FileText className="file-icon" size={18} />
              <input
                id="fileUpload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="custom-file-input"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <button onClick={uploadReport} disabled={isUploading || !file} className="btn-upload">
              {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
              Upload Report
            </button>
          </div>
        </div>
      )}

      <h2 className="section-title">Record History</h2>
        
      {isFetching ? (
        <div className="loading-state">
          <Loader2 className="animate-spin" size={32} color="var(--primary)" />
        </div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <Inbox className="empty-icon" size={48} />
          <h3>No records found</h3>
          <p>{role === 'doctor' ? "No records available for your patients." : "Get started by uploading a new report URL above."}</p>
        </div>
      ) : (
        <div className="records-grid">
          {records.map((rec) => (
            <div key={rec._id} className="record-card">
              <div className="record-header">
                <div className="doc-icon-wrapper">
                  <FileText size={24} />
                </div>
                <div className="doc-info">
                  <p className="doc-name" title={rec.reportUrl || "Prescription Record"}>
                    {rec.reportUrl ? (rec.reportUrl.split('/').pop() || "Document") : "Prescription Record"}
                  </p>
                  {rec.reportUrl && (
                    <a href={rec.reportUrl} target="_blank" rel="noreferrer" className="doc-link">
                      View Original <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              <div className="record-details">
                <div className="detail-row">
                  <UserCircle className="detail-icon" size={18} />
                  <span>
                    {role === 'doctor' ? "Patient: " : "Doctor: "} 
                    <strong>
                      {role === 'doctor' ? (rec.patient?.name || "Unknown Patient") : (rec.doctor?.name || "Pending Assignment")}
                    </strong>
                  </span>
                </div>
                <div className="detail-row" style={{ flex: 1 }}>
                  <Activity className="detail-icon" size={18} />
                  <div style={{ width: '100%' }}>
                    Prescription Notes:
                    {rec.prescription ? (
                      <div className="prescription-box">{rec.prescription}</div>
                    ) : (
                      <span className="status-italic" style={{ marginLeft: '8px' }}>Awaiting review</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Records;