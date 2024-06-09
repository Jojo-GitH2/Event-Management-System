// Import express, mongoose, dotenv

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");



// Import necessary routes

const userRoutes = require("./routes/userAuthRoutes");
const eventRoutes = require("./routes/eventRoutes");

// Initialize Express and Dotenv

const app = express();
app.use(express.json());
app.use(cookieParser());


dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() =>
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));


// Root Route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Routes for Users

app.use("/users", userRoutes);

// Routes for events

app.use("/events", eventRoutes);