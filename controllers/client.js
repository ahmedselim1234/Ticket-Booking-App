const Events = require("../models/event");
const Ticket = require("../models/tickets");

exports.getEvents = async (req, res, next) => {
  try {
    const allEvents = await Events.find().exec();

    if (!allEvents || allEvents.length === 0) {
      return res.status(404).json({ message: "We don't have Events" });
    }

    return res.status(200).json({ allEvents });
  } catch (err) {
    console.log("Error while fetching Events:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.bookticket = async (req, res, next) => {

  const { userId, eventId } = req.body;
  try {
    const hisTickets = await Ticket.find({ userId: userId });
    if (hisTickets.length >= 5) return res.status(401).json({ m: "you book maximam teckit =>5" });
    const event = await Events.findById(eventId);
    if (event.currentTeckits <= 0)
      return res.status(401).json({ M: "tickets is finished" });

    const ticket = await Ticket.create({
      userId: userId,
      eventId: eventId,
      price: event.price,
    });
    // const afterTickets = await Ticket.find({ userId, eventId });
    // console.log( afterTickets.length);

    const updatecurrentTeckits = await Events.findByIdAndUpdate(
      eventId,
      {
        $inc: { currentTeckits: -1 },
      },
      { new: true }
    );
    return res.status(200).json({ updatecurrentTeckits });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteBook = async (req, res, next) => {
  const user = req.params.id;
  try {
    const hisTickets = await Ticket.findOneAndDelete({ userId: user });
    console.log(hisTickets);
    if (!hisTickets)
      return res.status(404).json({ message: "you don't have tickets" });
    return res.status(201).json({ message: "ticket is deleted" });
  } catch (err) {
    console.log("Error while fetching Events:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getclientTickets = async (req, res, next) => {
  const user = req.params.id;
  try {
    const hisTickets = await Ticket.find({ userId: user });
    console.log(hisTickets);
    if (!hisTickets)
      return res.status(404).json({ message: "you don't have tickets" });
    return res.status(201).json({ Ticket: hisTickets });
  } catch (err) {
    console.log("Error while fetching Events:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
