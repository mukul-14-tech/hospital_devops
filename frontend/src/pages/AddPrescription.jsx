import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FileText, Stethoscope, FilePlus2, Loader2, User } from "lucide-react";

const THEME_CSS = `
  :root {
    --primary: #0d9488;
    --bg-light: #f8fafc;
    --bg-card: #ffffff;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --border: #e2e8f0;
    --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 10px 25px -5px rgba(0,0,0,0.05);
    --radius-lg: 16px;
    --radius-md: 12px;
  }

  .prescription-container {
    max-width: 650px;
    margin: 2rem auto;
    padding: 0 1.5rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: fadeIn 0.4s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .prescription-card {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border);
    overflow: hidden;
  }

  .prescription-header {
    background: linear-gradient(135deg, #ecfdf5 0%, #ccfbf1 100%);
    padding: 2.5rem 2rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    border-bottom: 1px solid #d1fae5;
  }

  .header-icon {
    width: 56px;
    height: 56px;
    background: #10b981;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 16px rgba(16, 185, 129, 0.25);
    flex-shrink: 0;
  }

  .header-text h2 {
    font-size: 1.75rem;
    color: var(--text-main);
    margin-bottom: 0.25rem;
    font-weight: 700;
  }

  .header-text p {
    color: var(--text-muted);
    font-size: 0.95rem;
  }

  .prescription-body {
    padding: 2.5rem;
  }

  .form-group {
    margin-bottom: 1.75rem;
  }

  .form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-main);
    margin-bottom: 0.5rem;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 1rem;
    color: var(--text-muted);
    pointer-events: none;
  }

  .form-control {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 2.75rem;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    font-family: inherit;
    font-size: 0.95rem;
    color: var(--text-main);
    background: var(--bg-card);
    transition: all 0.2s ease;
    appearance: none;
  }

  textarea.form-control {
    padding-left: 1rem; /* No icon in textarea */
    min-height: 120px;
    resize: vertical;
    line-height: 1.5;
  }

  .form-control:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
  }

  .select-arrow {
    position: absolute;
    right: 1rem;
    color: var(--text-muted);
    pointer-events: none;
  }

  .loading-box {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 2.75rem;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--bg-light);
    color: var(--text-muted);
    font-size: 0.95rem;
    display: flex;
    align-items: center;
  }

  .btn-submit {
    width: 100%;
    padding: 1rem;
    background: var(--text-main);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 2rem;
  }

  .btn-submit:hover:not(:disabled) {
    background: #000;
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

function AddPrescription() {
  const [patientId, setPatientId] = useState("");
  const [prescription, setPrescription] = useState("");
  const [patients, setPatients] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = THEME_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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
    <div className="prescription-container">
      <Toaster position="top-right" />
      
      <div className="prescription-card">
        <div className="prescription-header">
          <div className="header-icon">
            <Stethoscope color="white" size={28} />
          </div>
          <div className="header-text">
            <h2>Clinical Prescription</h2>
            <p>Issue new medical notes or prescriptions to a patient.</p>
          </div>
        </div>

        <div className="prescription-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select Patient</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                {isLoadingPatients ? (
                  <div className="loading-box">
                    <Loader2 className="animate-spin" size={18} style={{ marginRight: '8px' }} /> 
                    Loading patients...
                  </div>
                ) : (
                  <>
                    <select
                      required
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      className="form-control"
                    >
                      <option value="" disabled>Choose a patient...</option>
                      {patients.map(p => (
                        <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
                      ))}
                    </select>
                    <svg className="select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Prescription / Notes</label>
              <textarea
                required
                rows={5}
                placeholder="e.g., Take Amoxicillin 500mg twice daily for 7 days..."
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                className="form-control"
              />
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting || isLoadingPatients}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <FilePlus2 size={20} />
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