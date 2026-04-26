const request = require("supertest");
const app = require("../server");

describe("Auth API", () => {

  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "testuser@test.com",
        password: "123456",
        role: "patient"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered");
  });

  it("should login user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

});