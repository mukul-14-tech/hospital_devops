jest.setTimeout(10000);
const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
require("./setup");

describe("Appointment API", () => {
  let patientToken;
  let doctorToken;
  let doctorId;
  let appointmentId;

  // We use a unique prefix so users don't collide in the database
  const uniqueId = Date.now();
  const patientEmail = `patient${uniqueId}@test.com`;
  const doctorEmail = `doctor${uniqueId}@test.com`;

  beforeAll(async () => {
    // 1. Register a Patient
    const patientRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Patient",
        email: patientEmail,
        password: "password123",
        role: "patient"
      });
    
    // 2. Login Patient to get token
    const patientLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: patientEmail, password: "password123" });
    patientToken = patientLogin.body.token;

    // 3. Register a Doctor
    const doctorRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Doctor",
        email: doctorEmail,
        password: "password123",
        role: "doctor"
      });
    doctorId = doctorRes.body.user._id;

    // 4. Login Doctor to get token
    const doctorLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: doctorEmail, password: "password123" });
    doctorToken = doctorLogin.body.token;
  });

  it("should allow a patient to book an appointment", async () => {
    const res = await request(app)
      .post("/api/appointments/book")
      .set("Authorization", `Bearer ${patientToken}`)
      .send({
        doctorId,
        date: new Date().toISOString()
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Appointment booked");
    appointmentId = res.body.appointment._id;
  });

  it("should not allow booking without doctorId or date", async () => {
    const res = await request(app)
      .post("/api/appointments/book")
      .set("Authorization", `Bearer ${patientToken}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please provide doctorId and date.");
  });

  it("should allow a doctor to view their appointments", async () => {
    const res = await request(app)
      .get("/api/appointments/doctor")
      .set("Authorization", `Bearer ${doctorToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]._id).toBe(appointmentId);
  });

  it("should allow a doctor to update appointment status", async () => {
    const res = await request(app)
      .put(`/api/appointments/${appointmentId}/status`)
      .set("Authorization", `Bearer ${doctorToken}`)
      .send({ status: "confirmed" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Appointment status updated");
    expect(res.body.appointment.status).toBe("confirmed");
  });

  it("should reject invalid status updates", async () => {
    const res = await request(app)
      .put(`/api/appointments/${appointmentId}/status`)
      .set("Authorization", `Bearer ${doctorToken}`)
      .send({ status: "invalid_status" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid status");
  });
});
