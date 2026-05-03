const Ticket = require("../models/tickets");
const User = require("../models/user");
const Event = require("../models/event");
const AppError = require("../util/AppError");
const { successResponse } = require("../util/response");
const logger = require("../util/logger");

exports.getTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find().populate("userId", "first_name email").populate("eventId", "title date");
    return successResponse(res, 200, "Tickets retrieved successfully", { tickets, count: tickets.length });
  } catch (err) {
    next(err);
  }
};

exports.getTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("userId", "first_name email").populate("eventId", "title date price");
    if (!ticket) return next(new AppError("Ticket not found", 404));
    return successResponse(res, 200, "Ticket retrieved successfully", { ticket });
  } catch (err) {
    next(err);
  }
};

exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    return successResponse(res, 200, "Events retrieved successfully", { events, count: events.length });
  } catch (err) {
    next(err);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return next(new AppError("Event not found", 404));
    return successResponse(res, 200, "Event retrieved successfully", { event });
  } catch (err) {
    next(err);
  }
};

exports.addEvent = async (req, res, next) => {
  try {
    const { title, place, date, price, maxTickets } = req.body;
    const event = await Event.create({ title, place, date, price, maxTickets, currentTickets: maxTickets });
    logger.info("Event created", { eventId: event._id, title });
    return successResponse(res, 201, "Event created successfully", { event });
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const { title, place, date, price, maxTickets } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (place !== undefined) updateData.place = place;
    if (date !== undefined) updateData.date = date;
    if (price !== undefined) updateData.price = price;
    if (maxTickets !== undefined) {
      updateData.maxTickets = maxTickets;
      updateData.currentTickets = maxTickets;
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!event) return next(new AppError("Event not found", 404));

    logger.info("Event updated", { eventId: event._id });
    return successResponse(res, 200, "Event updated successfully", { event });
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return next(new AppError("Event not found", 404));
    logger.info("Event deleted", { eventId: req.params.id });
    return successResponse(res, 200, "Event deleted successfully");
  } catch (err) {
    next(err);
  }
};

exports.getClients = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id).select("-password");
    if (!client) return next(new AppError("Client not found", 404));
    return successResponse(res, 200, "Client retrieved successfully", { client });
  } catch (err) {
    next(err);
  }
};
