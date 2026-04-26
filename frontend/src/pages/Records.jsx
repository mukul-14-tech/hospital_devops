import { useEffect, useState } from "react";
import axios from "axios";

function Records() {
  const [records, setRecords] = useState([]);
  const [reportUrl, setReportUrl] = useState("");

  const token = localStorage.getItem("token");

  const fetchRecords = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/records/my",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setRecords(res.data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const uploadReport = async () => {
    await axios.post(
      "http://localhost:5000/api/records/upload",
      { reportUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setReportUrl("");
    fetchRecords();
  };

  return (
    <div>
      <h2>My Records</h2>

      <input
        placeholder="Report URL"
        value={reportUrl}
        onChange={(e) => setReportUrl(e.target.value)}
      />

      <button onClick={uploadReport}>Upload</button>

      <hr />

      {records.map((rec) => (
        <div key={rec._id}>
          <p>Report: {rec.reportUrl}</p>
          <p>Prescription: {rec.prescription || "Not added yet"}</p>
          <p>Doctor: {rec.doctor?.name || "N/A"}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Records;