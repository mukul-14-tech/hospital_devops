const request = require("supertest");
const app = require("../server");

describe("Record API", () => {
  let patientToken;
  let doctorToken;
  let patientId;
  let recordId;

  const uniqueId = Date.now();
  const patientEmail = `recpatient${uniqueId}@test.com`;
  const doctorEmail = `recdoctor${uniqueId}@test.com`;

  beforeAll(async () => {
    // 1. Register Patient
    const patientRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Record Patient",
        email: patientEmail,
        password: "password123",
        role: "patient"
      });
    patientId = patientRes.body.user._id;

    // 2. Login Patient
    const patientLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: patientEmail, password: "password123" });
    patientToken = patientLogin.body.token;

    // 3. Register Doctor
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Record Doctor",
        email: doctorEmail,
        password: "password123",
        role: "doctor"
      });

    // 4. Login Doctor
    const doctorLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: doctorEmail, password: "password123" });
    doctorToken = doctorLogin.body.token;
  });

  it("should allow a patient to upload a report", async () => {
    const res = await request(app)
      .post("/api/records/upload")
      .set("Authorization", `Bearer ${patientToken}`)
      .send({ reportUrl: "http://example.com/report.pdf" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Report uploaded");
    expect(res.body.record.reportUrl).toBe("http://example.com/report.pdf");
    recordId = res.body.record._id;
  });

  it("should not allow a patient to upload an empty reportUrl", async () => {
    const res = await request(app)
      .post("/api/records/upload")
      .set("Authorization", `Bearer ${patientToken}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please provide a reportUrl or upload a file.");
  });

  it("should allow a doctor to add a prescription to an existing record", async () => {
    const res = await request(app)
      .post("/api/records/prescription")
      .set("Authorization", `Bearer ${doctorToken}`)
      .send({
        recordId,
        prescription: "Take 2 pills daily"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Prescription added");
    expect(res.body.record.prescription).toBe("Take 2 pills daily");
  });

  it("should allow a doctor to create a new record for a patient with a prescription", async () => {
    const res = await request(app)
      .post("/api/records/prescription")
      .set("Authorization", `Bearer ${doctorToken}`)
      .send({
        patientId,
        prescription: "New prescription for patient"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Prescription added");
    expect(res.body.record.patient).toBe(patientId);
    expect(res.body.record.prescription).toBe("New prescription for patient");
  });

  it("should allow a patient to view their own records", async () => {
    const res = await request(app)
      .get("/api/records/my")
      .set("Authorization", `Bearer ${patientToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThanOrEqual(2); // The uploaded one and the created one
  });

  it("should reject prescription if no prescription text is provided", async () => {
    const res = await request(app)
      .post("/api/records/prescription")
      .set("Authorization", `Bearer ${doctorToken}`)
      .send({ recordId });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please provide a prescription.");
  });
});
