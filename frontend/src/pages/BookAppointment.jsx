import { useState } from "react";
import axios from "axios";

function BookAppointment() {
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/appointments/book",
        { doctorId, date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Appointment booked");
    } catch (err) {
      alert("Error booking");
    }
  };

  return (
    <div>
      <h2>Book Appointment</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Doctor ID"
          onChange={(e) => setDoctorId(e.target.value)}
        />

        <input
          type="date"
          onChange={(e) => setDate(e.target.value)}
        />

        <button type="submit">Book</button>
      </form>
    </div>
  );
}

export default BookAppointment;