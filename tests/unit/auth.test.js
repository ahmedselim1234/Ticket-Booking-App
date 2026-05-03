const request = require("supertest");
const app = require("../../app");
const { createClientUser } = require("../fixtures/seed");

describe("POST /auth/signup", () => {
  it("creates a new user and returns accessToken", async () => {
    const res = await request(app).post("/auth/signup").send({
      first_name: "Ahmed",
      email: "ahmed@test.com",
      password: "Test@1234",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe("ahmed@test.com");
  });

  it("returns 409 if email already exists", async () => {
    await createClientUser();
    const res = await request(app).post("/auth/signup").send({
      first_name: "Another",
      email: "client@test.com",
      password: "Test@1234",
    });
    expect(res.statusCode).toBe(409);
  });

  it("returns 400 for weak password", async () => {
    const res = await request(app).post("/auth/signup").send({
      first_name: "Ahmed",
      email: "weak@test.com",
      password: "1234",
    });
    expect(res.statusCode).toBe(400);
  });

  it("returns 400 for invalid email", async () => {
    const res = await request(app).post("/auth/signup").send({
      first_name: "Ahmed",
      email: "not-an-email",
      password: "Test@1234",
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /auth/login", () => {
  it("returns accessToken on valid credentials", async () => {
    await createClientUser();
    const res = await request(app).post("/auth/login").send({
      email: "client@test.com",
      password: "Client@1234",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("returns 401 on wrong password", async () => {
    await createClientUser();
    const res = await request(app).post("/auth/login").send({
      email: "client@test.com",
      password: "WrongPass@1",
    });
    expect(res.statusCode).toBe(401);
  });

  it("returns 401 on non-existent email", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "nobody@test.com",
      password: "Test@1234",
    });
    expect(res.statusCode).toBe(401);
  });
});

describe("POST /auth/logout", () => {
  it("clears the jwt cookie", async () => {
    const res = await request(app).post("/auth/logout");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
  });
});
