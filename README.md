# 🏥 Hospital Appointment & Patient Health Record System (DevOps Project)

---

## 📌 Project Overview

This is a full-stack **Hospital Management System** with DevOps integration.

It allows:

* Patients to book appointments and upload medical reports
* Doctors to view appointments and add prescriptions
* Admin to manage doctors, users, and system analytics

The project also includes:

* Docker containerization
* CI/CD readiness (Jenkins integration coming next)

---

### 🔐 Authentication System

* User Registration (Patient / Doctor / Admin)
* Login with JWT authentication
* Password hashing using bcrypt

---

### 👨‍⚕️ Role-Based System

* Patient → Book appointment, upload reports
* Doctor → View appointments, add prescriptions
* Admin → Manage users, add doctors, view stats

---

### 📅 Appointment System

* Book appointment (Patient)
* View appointments (Patient)
* View appointments (Doctor)

---

### 🏥 EHR (Electronic Health Records)

* Upload report (URL-based for now)
* Add prescription (Doctor)
* View patient medical history

---

### 🧑‍💼 Admin Dashboard

* View all users
* Add doctor
* View system stats:

  * Total users
  * Total doctors
  * Total appointments

---

### ⚛️ Frontend (React)

* Login & Register UI
* Dashboard navigation
* Book appointment UI
* View appointments UI
* Medical records UI
* Admin dashboard UI

---

### 🧪 Testing

* Jest + Supertest for backend testing
* Auth API tested

---

### 🐳 Docker (Containerization)

* Backend container
* Frontend container
* MongoDB container
* Multi-service setup using docker-compose

---

## 🧰 Tech Stack

### 🌐 Frontend

* React (Vite)
* Axios
* React Router DOM
* Tailwind CSS

### 📦 Additional Frontend Libraries

```bash
npm install axios react-router-dom react-hot-toast lucide-react jwt-decode clsx tailwind-merge
npm install -D tailwindcss @tailwindcss/postcss postcss autoprefixer
```

---

### 🖥 Backend

* Node.js
* Express.js

---

### 🔐 Authentication

* JWT (jsonwebtoken)
* bcryptjs

---

### 🗄 Database

* MongoDB (Atlas / Docker)

---

### 🧪 Testing

* Jest
* Supertest

---

### 🐳 DevOps

* Docker
* Docker Compose

---

## 📂 Project Structure

```
hospital-devops-project/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── server.js
│   ├── index.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── docker-compose.yml
├── README.md
```

---

## ⚙️ Local Setup Instructions (Without Docker)

---

### 🔹 1. Clone Repository

```bash
git clone <your-repo-link>
cd hospital-devops-project
```

---

### 🔹 2. Setup Backend

```bash
cd backend
npm install
```

---

### 🔹 Create `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
```

---

### 🔹 Run Backend

```bash
npm run dev
```

---

### 🔹 3. Setup Frontend

```bash
cd frontend
npm install
```

---

### 🔹 Run Frontend

```bash
npm run dev
```

---

### 🔹 Open App

```
http://localhost:5173
```

---

## 🐳 Docker Setup (Recommended)

---

### 🔹 Update Backend `.env`

```env
MONGO_URI=mongodb://mongo:27017/hospitalDB
```

---

### 🔹 Run Project

```bash
docker-compose up --build
```

---

### 🔹 Access App

* Frontend → http://localhost:5173
* Backend → http://localhost:5000

---

## 🔗 API Endpoints

---

### 🔐 Auth

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |

---

### 📅 Appointments

| Method | Endpoint                  |
| ------ | ------------------------- |
| POST   | /api/appointments/book    |
| GET    | /api/appointments/patient |
| GET    | /api/appointments/doctor  |

---

### 🏥 Records

| Method | Endpoint                  |
| ------ | ------------------------- |
| POST   | /api/records/upload       |
| POST   | /api/records/prescription |
| GET    | /api/records/my           |

---

### 🧑‍💼 Admin

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | /api/admin/users  |
| POST   | /api/admin/doctor |
| GET    | /api/admin/stats  |

---

## 🔑 Authentication

All protected routes require:

```bash
Authorization: Bearer <JWT_TOKEN>
```

---

## 🧠 Learning Outcomes

* Built full-stack MERN application
* Implemented JWT authentication
* Designed role-based system
* Integrated frontend with backend APIs
* Used Docker for containerization
* Wrote automated tests using Jest


---

## 👨‍💻 Author

Mukul
