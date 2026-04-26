import { useState } from "react";
import axios from "axios";

function AddPrescription() {
  const [recordId, setRecordId] = useState("");
  const [prescription, setPrescription] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    await axios.post(
      "http://localhost:5000/api/records/prescription",
      { recordId, prescription },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Prescription added");
  };

  return (
    <div>
      <h2>Add Prescription</h2>

      <input
        placeholder="Record ID"
        onChange={(e) => setRecordId(e.target.value)}
      />

      <input
        placeholder="Prescription"
        onChange={(e) => setPrescription(e.target.value)}
      />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default AddPrescription;