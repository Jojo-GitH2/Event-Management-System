// Import express, mongoose, dotenv

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Initialize Express and Dotenv

const app = express();
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
