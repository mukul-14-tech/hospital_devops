import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { CalendarPlus, User, Calendar as CalendarIcon, Loader2 } from "lucide-react";

const THEME_CSS = `
  :root {
    --primary: #0d9488;
    --primary-hover: #0f766e;
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

  .booking-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 0 1.5rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: fadeIn 0.4s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .booking-card {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border);
    overflow: hidden;
  }

  .booking-header {
    background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
    padding: 2.5rem 2rem;
    text-align: center;
    border-bottom: 1px solid var(--border);
  }

  .header-icon {
    width: 56px;
    height: 56px;
    background: var(--primary);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem auto;
    box-shadow: 0 8px 16px rgba(13, 148, 136, 0.2);
  }

  .booking-header h2 {
    font-size: 1.75rem;
    color: var(--text-main);
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  .booking-header p {
    color: var(--text-muted);
    font-size: 0.95rem;
  }

  .booking-body {
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

  .form-control:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.1);
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

function BookAppointment() {
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = THEME_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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
    <div className="booking-container">
      <div className="booking-card">
        <div className="booking-header">
          <div className="header-icon">
            <CalendarPlus color="white" size={28} />
          </div>
          <h2>Schedule a Visit</h2>
          <p>Book your next consultation securely.</p>
        </div>

        <div className="booking-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select Specialist</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                {isLoadingDoctors ? (
                  <div className="loading-box">
                    <Loader2 className="animate-spin" size={18} style={{ marginRight: '8px' }} /> 
                    Loading doctors...
                  </div>
                ) : (
                  <>
                    <select
                      required
                      value={doctorId}
                      onChange={(e) => setDoctorId(e.target.value)}
                      className="form-control"
                    >
                      <option value="" disabled>Choose a specialist...</option>
                      {doctors.map(doc => (
                        <option key={doc._id} value={doc._id}>Dr. {doc.name} ({doc.email})</option>
                      ))}
                    </select>
                    <svg className="select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Date</label>
              <div className="input-wrapper">
                <CalendarIcon className="input-icon" size={18} />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting || isLoadingDoctors}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;