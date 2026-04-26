# 🏥 Hospital Appointment & Patient Record System (Backend)

## 📌 Project Overview

This project is a backend system for managing hospital operations such as user authentication and appointment booking.

It allows:

* Patients to register and book appointments
* Doctors to view their appointments
* Secure authentication using JWT
* Data storage using MongoDB

---

## 🚀 Features Implemented (Day 1–3)

### 🔐 Authentication System

* User Registration (Patient / Doctor / Admin)
* User Login with JWT Token
* Password hashing using bcrypt

### 👨‍⚕️ Role-Based Users

* Patient
* Doctor
* Admin

### 📅 Appointment System

* Book appointment (Patient)
* View appointments (Patient)
* View appointments (Doctor)

### 🛡 Protected Routes

* JWT-based middleware
* Only authenticated users can access APIs

---

## 🧰 Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Atlas)

### Authentication

* JWT (jsonwebtoken)
* bcryptjs

### Testing Tools

* Postman / Thunder Client

---

## 📂 Folder Structure

backend/
│
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── appointmentController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   └── Appointment.js
├── routes/
│   ├── authRoutes.js
│   └── appointmentRoutes.js
├── server.js
└── .env

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-link>
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Run the Server

```bash
npm run dev
```

---

## 🔗 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login    | Login user    |

---

### 📅 Appointment Routes

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| POST   | /api/appointments/book    | Book appointment     |
| GET    | /api/appointments/patient | Patient appointments |
| GET    | /api/appointments/doctor  | Doctor appointments  |

---

## 🧪 Testing APIs

Use tools like:

* Postman
* Thunder Client

### 🔑 Authorization Header

```bash
Authorization: Bearer <JWT_TOKEN>
```

---

## 🧠 Learning Outcomes

* Built REST APIs using Express
* Implemented JWT Authentication
* Connected MongoDB using Mongoose
* Created protected routes
* Designed relational data (User ↔ Appointment)

---

## 🚧 Upcoming Features (Next Phases)

* Patient Health Records (EHR)
* File Upload (Reports & Prescriptions)
* Docker Containerization
* Jenkins CI/CD Pipeline
* Deployment on Cloud

---

## 👨‍💻 Author

Mukul

---