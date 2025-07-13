const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    place: {
      type: String,
      required: [true, "place is required"],
    },
    date: {
      type: Date,
      required: [true, "date is required"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    maxTeckts: {
      type: Number,
      required: [true, "maxTeckits is required"],
    },
    currentTeckits: {
      type: Number,
     required: [true, "currentTeckits is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
