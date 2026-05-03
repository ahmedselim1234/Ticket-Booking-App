const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const Ticket = require("../../models/tickets");
const { createClientUser, createEvent } = require("../fixtures/seed");

let client;
let clientToken;

beforeEach(async () => {
  client = await createClientUser();
  clientToken = jwt.sign(
    { userInfo: { id: client._id, role: "client" } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
});

describe("GET /", () => {
  it("returns available events without auth", async () => {
    await createEvent();
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.events)).toBe(true);
  });
});

describe("POST /bookticket", () => {
  it("books a ticket successfully", async () => {
    const event = await createEvent();
    const res = await request(app)
      .post("/bookticket")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({ userId: client._id.toString(), eventId: event._id.toString() });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.ticket.userId.toString()).toBe(client._id.toString());
  });

  it("returns 400 when ticket limit reached", async () => {
    const event = await createEvent({ maxTickets: 10, currentTickets: 10 });
    for (let i = 0; i < 5; i++) {
      await Ticket.create({ userId: client._id, eventId: event._id, price: 100 });
    }
    const res = await request(app)
      .post("/bookticket")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({ userId: client._id.toString(), eventId: event._id.toString() });
    expect(res.statusCode).toBe(400);
  });

  it("returns 400 when no tickets available", async () => {
    const event = await createEvent({ maxTickets: 1, currentTickets: 0 });
    const res = await request(app)
      .post("/bookticket")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({ userId: client._id.toString(), eventId: event._id.toString() });
    expect(res.statusCode).toBe(400);
  });

  it("returns 401 without auth token", async () => {
    const event = await createEvent();
    const res = await request(app)
      .post("/bookticket")
      .send({ userId: client._id.toString(), eventId: event._id.toString() });
    expect(res.statusCode).toBe(401);
  });
});

describe("DELETE /deletebook/:id", () => {
  it("cancels a ticket successfully", async () => {
    const event = await createEvent();
    const ticket = await Ticket.create({
      userId: client._id,
      eventId: event._id,
      price: 100,
    });
    const res = await request(app)
      .delete(`/deletebook/${ticket._id}`)
      .set("Authorization", `Bearer ${clientToken}`);
    expect(res.statusCode).toBe(200);
  });

  it("returns 404 for non-existent ticket", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/deletebook/${fakeId}`)
      .set("Authorization", `Bearer ${clientToken}`);
    expect(res.statusCode).toBe(404);
  });
});

describe("GET /getclientTickets/:id", () => {
  it("returns all tickets for the client", async () => {
    const event = await createEvent();
    await Ticket.create({ userId: client._id, eventId: event._id, price: 100 });
    const res = await request(app)
      .get(`/getclientTickets/${client._id}`)
      .set("Authorization", `Bearer ${clientToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.tickets).toHaveLength(1);
  });
});
