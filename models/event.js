const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    place: {
      type: String,
      required: [true, "Place is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    maxTickets: {
      type: Number,
      required: [true, "Max tickets is required"],
      min: [1, "Max tickets must be at least 1"],
    },
    currentTickets: {
      type: Number,
      required: [true, "Current tickets count is required"],
      min: [0, "Current tickets cannot be negative"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
