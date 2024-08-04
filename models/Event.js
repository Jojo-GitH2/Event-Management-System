// Events Model

const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter a title"],
    },
    description: {
      type: String,
      required: [true, "Please enter a description"]
    },
    date: {
      type: Date,
      required: [true, "Please enter a date in this format: YYYY-MM-DD"],
      index : true,
    },
    time: {
      type: String,
      required: [true, "Please enter a time in this format: HH:MM AM/PM"]
    },
    status: {
      type: String,
      default: "Open",
      enum: ["Open", "Closed"]
    }
    ,
    location: {
      type: String,
      required: [true, "Please enter a location"]
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    // created_at: {
    //   type: Date,
    //   default: Date.now
    // },
  },
  { timestamps: true }
);

// Create a Mongoose hook to validate the date and time
EventSchema.pre("save", function (next) {


  const year = this.date.getFullYear();
  const month = this.date.getMonth() + 1;
  const day = this.date.getDate();

  const [time, period] = this.time.split(" ");
  const [hours, minutes] = time.split(":").map(Number);

  const adjustedHours = period === "PM" ? hours + 12 : hours; // Adjust for PM

  this.date = new Date(year, month - 1, day, adjustedHours, minutes).toDateString();
  
  // this.date = new Date(this.date);
  // console.log(this.date);


  // Ensure that the time is in the format HH:MM AM/PM
  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59 || (period !== "AM" && period !== "PM")) {
    return next(new Error("Please enter a time in this format: HH:MM AM/PM"));
  };
  
  console.log(this.date, new Date(), this.date < new Date(), this.date > new Date(), typeof this.date, typeof new Date());



  // Ensure that the date is not in the past
  if (this.date < new Date()) {
    return next(new Error("Event date cannot be in the past"));
  }
  next();
});

// Avoid creation of Events in duplicates
EventSchema.index({ title: 1, organizer: 1 }, { unique: true });

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
