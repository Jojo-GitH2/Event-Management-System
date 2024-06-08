// User Model

const mongoose = require("mongoose");

const { isEmail } = require('validator');

const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please enter a username'],
      
    },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      lowercase: true,
      validate : [isEmail, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Minimum password length is 6 characters']
    },
    role: {
      type: String,
      default: "user"
    },
    verified: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);


// Mongoose Hooks for password hashing with bcryptjs

UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


const User = mongoose.model("User", UserSchema);

module.exports = User;
