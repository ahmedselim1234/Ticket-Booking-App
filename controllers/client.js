const mongoose = require("mongoose");
const Event = require("../models/event");
const Ticket = require("../models/tickets");
const AppError = require("../util/AppError");
const { successResponse } = require("../util/response");
const logger = require("../util/logger");

const MAX_TICKETS_PER_USER = 5;

exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ currentTickets: { $gt: 0 } }).sort({ date: 1 });
    return successResponse(res, 200, "Events retrieved successfully", { events, count: events.length });
  } catch (err) {
    next(err);
  }
};

exports.bookticket = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId, eventId } = req.body;

    const userTicketCount = await Ticket.countDocuments({ userId }).session(session);
    if (userTicketCount >= MAX_TICKETS_PER_USER) {
      await session.abortTransaction();
      return next(new AppError(`You have reached the maximum booking limit of ${MAX_TICKETS_PER_USER} tickets`, 400));
    }

    const event = await Event.findById(eventId).session(session);
    if (!event) {
      await session.abortTransaction();
      return next(new AppError("Event not found", 404));
    }
    if (event.currentTickets <= 0) {
      await session.abortTransaction();
      return next(new AppError("No tickets available for this event", 400));
    }

    const [ticket] = await Ticket.create([{ userId, eventId, price: event.price }], { session });

    await Event.findByIdAndUpdate(eventId, { $inc: { currentTickets: -1 } }, { session });

    await session.commitTransaction();

    logger.info("Ticket booked", { ticketId: ticket._id, userId, eventId });
    return successResponse(res, 201, "Ticket booked successfully", { ticket });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

exports.deleteBook = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const ticketId = req.params.id;

    const ticket = await Ticket.findById(ticketId).session(session);
    if (!ticket) {
      await session.abortTransaction();
      return next(new AppError("Ticket not found", 404));
    }

    await Ticket.findByIdAndDelete(ticketId, { session });
    await Event.findByIdAndUpdate(ticket.eventId, { $inc: { currentTickets: 1 } }, { session });

    await session.commitTransaction();

    logger.info("Ticket cancelled", { ticketId });
    return successResponse(res, 200, "Ticket cancelled successfully");
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

exports.getclientTickets = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const tickets = await Ticket.find({ userId }).populate("eventId", "title place date price");
    return successResponse(res, 200, "Tickets retrieved successfully", { tickets, count: tickets.length });
  } catch (err) {
    next(err);
  }
};
