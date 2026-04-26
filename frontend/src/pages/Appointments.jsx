import { useEffect, useState } from "react";
import axios from "axios";

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/appointments/patient",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments(res.data);
    };

    fetchAppointments();
  }, []);

  return (
    <div>
      <h2>My Appointments</h2>

      {appointments.map((appt) => (
        <div key={appt._id}>
          <p>Doctor: {appt.doctor?.name}</p>
          <p>Date: {new Date(appt.date).toDateString()}</p>
          <p>Status: {appt.status}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Appointments;