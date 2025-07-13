const Ticket = require("../models/tickets");
const Client = require("../models/user");
const Event = require("../models/event");


exports.getTickets = async (req, res, next) => {
  try {
    const allTickets = await Ticket.find().exec();

    if (!allTickets || allTickets.length === 0) {
      return res.status(404).json({ message: "We don't have tickets" });
    }

    return res.status(200).json({ allTickets });
  } catch (err) {
    console.log("Error while fetching tickets:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.addEvent = async (req, res, next) => {
  const { title, place, date, price, maxTeckts, currentTeckits } = req.body;
  if (!title || !place || !date || !price || !maxTeckts)
    return res.json({ m: "fill all fields" });
  try {
    const event = await Event.create({
      title,
      place,
      date,
      price,
      maxTeckts,
      currentTeckits: maxTeckts,
    });
    return res.status(200).json({ message: ` event created ${event}` });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: ` event not  created ` });
  }
};

exports.updateEvent = async (req, res, next) => {
  const { title, place, date, price, maxTeckts, currentTeckits } = req.body;
  try {
    const specificEvent = await Event.findByIdAndUpdate(req.params.id, {
      title,
      place,
      date,
      price,
      maxTeckts,
      currentTeckits: maxTeckts,
    });
     const specificEvent1 = await Event.findById(req.params.id)
    return res.status(200).json({ message: ` event updated ${specificEvent1}` });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: ` event not  updated ` });
  }
};


exports.getEvents = async (req, res, next) => {
  try {
    const allEvents = await Event.find().exec();

    if (!allEvents || allEvents.length === 0) {
      return res.status(404).json({ message: "We don't have Events" });
    }

    return res.status(200).json({ allEvents });
  } catch (err) {
    console.log("Error while fetching Events:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getTicket = async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(403).json({ m: "not found ticket " });
  return res.status(201).json({ ticket: `is  ${ticket}` });
};

exports.getEvent = async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(403).json({ m: "not found event " });
  return res.status(201).json({ event: `is  ${event}` });
};

exports.deleteevent = async (req, res, next) => {
  try {
     const event = await Event.findByIdAndDelete(req.params.id);
       res.status(200).json({ event});
  } catch (err) {
    console.log(err);
  }

};

exports.getClients = async (req, res, next) => {
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(403).json({ m: "not found clients " });
  return res.status(201).json({ client: `is  ${client}` });
};
