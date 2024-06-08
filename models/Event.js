// Events Model

const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
