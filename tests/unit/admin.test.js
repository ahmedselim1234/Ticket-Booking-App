const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const { createAdminUser, createClientUser, createEvent } = require("../fixtures/seed");

let adminToken;
let clientToken;

beforeEach(async () => {
  const admin = await createAdminUser();
  const client = await createClientUser();
  adminToken = jwt.sign(
    { userInfo: { id: admin._id, role: "admin" } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  clientToken = jwt.sign(
    { userInfo: { id: client._id, role: "client" } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
});

describe("POST /admin/addevent", () => {
  it("creates an event as admin", async () => {
    const res = await request(app)
      .post("/admin/addevent")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Concert",
        place: "Cairo",
        date: new Date(Date.now() + 86400000).toISOString(),
        price: 200,
        maxTickets: 100,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.event.title).toBe("Concert");
  });

  it("returns 403 if client tries to create event", async () => {
    const res = await request(app)
      .post("/admin/addevent")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({
        title: "X",
        place: "Y",
        date: new Date(Date.now() + 86400000).toISOString(),
        price: 10,
        maxTickets: 5,
      });
    expect(res.statusCode).toBe(403);
  });

  it("returns 400 for missing required fields", async () => {
    const res = await request(app)
      .post("/admin/addevent")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "No price event" });
    expect(res.statusCode).toBe(400);
  });
});

describe("GET /admin/getevents", () => {
  it("returns all events for admin", async () => {
    await createEvent();
    const res = await request(app)
      .get("/admin/getevents")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.events).toHaveLength(1);
  });

  it("returns 401 without token", async () => {
    const res = await request(app).get("/admin/getevents");
    expect(res.statusCode).toBe(401);
  });
});

describe("PUT /admin/updateEvent/:id", () => {
  it("updates an event", async () => {
    const event = await createEvent();
    const res = await request(app)
      .put(`/admin/updateEvent/${event._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Updated Title" });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.event.title).toBe("Updated Title");
  });
});

describe("DELETE /admin/deleteevent/:id", () => {
  it("deletes an event as admin", async () => {
    const event = await createEvent();
    const res = await request(app)
      .delete(`/admin/deleteevent/${event._id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });

  it("returns 404 for non-existent event", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/admin/deleteevent/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });
});

describe("GET /admin/getevent/:id", () => {
  it("returns a single event", async () => {
    const event = await createEvent();
    const res = await request(app)
      .get(`/admin/getevent/${event._id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.event._id.toString()).toBe(event._id.toString());
  });

  it("returns 404 for non-existent event", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/admin/getevent/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });
});

describe("GET /admin/gettickets", () => {
  it("returns all tickets", async () => {
    const res = await request(app)
      .get("/admin/gettickets")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("tickets");
  });
});

describe("GET /admin/getclients/:id", () => {
  it("returns a client by ID", async () => {
    const User = require("../../models/user");
    const client = await User.findOne({ role: "client" });
    const res = await request(app)
      .get(`/admin/getclients/${client._id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.client.email).toBe("client@test.com");
  });

  it("returns 404 for non-existent client", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/admin/getclients/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });
});
