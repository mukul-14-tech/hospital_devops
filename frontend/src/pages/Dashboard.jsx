import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      <button onClick={() => navigate("/records")}>
        My Records
        </button>

        <button onClick={() => navigate("/prescription")}>
        Add Prescription (Doctor)
        </button>

      <button onClick={() => navigate("/book")}>
        Book Appointment
      </button>

      <button onClick={() => navigate("/appointments")}>
        View Appointments
      </button>
    </div>
  );
}

export default Dashboard;