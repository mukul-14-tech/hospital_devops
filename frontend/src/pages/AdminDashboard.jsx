import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
  totalUsers: 0,
  totalDoctors: 0,
  totalAppointments: 0
});
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    password: "",
  });

  const token = localStorage.getItem("token");

  // Fetch users
  const fetchUsers = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/users",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setUsers(res.data);
  };

  // Fetch stats
  const fetchStats = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/stats",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setStats(res.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  // Add doctor
  const addDoctor = async () => {
    await axios.post(
      "http://localhost:5000/api/admin/doctor",
      doctor,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Doctor added");
    fetchUsers();
    fetchStats();
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <h3>Stats</h3>
      <p>Total Users: {stats.users}</p>
      <p>Total Appointments: {stats.appointments}</p>
      

      <hr />

      <h3>Add Doctor</h3>

      <input placeholder="Name"
        onChange={(e) => setDoctor({...doctor, name: e.target.value})}
      />

      <input placeholder="Email"
        onChange={(e) => setDoctor({...doctor, email: e.target.value})}
      />

      <input placeholder="Password"
        onChange={(e) => setDoctor({...doctor, password: e.target.value})}
      />

      <button onClick={addDoctor}>Add Doctor</button>

      <hr />

      <h3>All Users</h3>

      {users.map((u) => (
        <div key={u._id}>
          <p>{u.name} - {u.role}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;