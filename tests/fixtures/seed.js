const bcrypt = require("bcrypt");
const User = require("../../models/user");
const Event = require("../../models/event");

exports.createAdminUser = async () => {
  const password = await bcrypt.hash("Admin@1234", 12);
  return User.create({ first_name: "Admin", email: "admin@test.com", password, role: "admin" });
};

exports.createClientUser = async () => {
  const password = await bcrypt.hash("Client@1234", 12);
  return User.create({ first_name: "Client", email: "client@test.com", password, role: "client" });
};

exports.createEvent = async (overrides = {}) => {
  return Event.create({
    title: "Test Event",
    place: "Test Venue",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    price: 100,
    maxTickets: 50,
    currentTickets: 50,
    ...overrides,
  });
};
