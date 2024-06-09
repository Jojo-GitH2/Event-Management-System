const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Token = require("../models/Token");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const handleValidationErrors = (error) => {
    let errorMessages = {email: '', password: '', username: ''};

    // Validation errors
    if (error.message.includes("User validation failed")) {
        Object.values(error.errors).forEach(({ properties }) => {
            errorMessages[properties.path] = properties.message;
        });
    }
    // Duplicate key error
    if (error.code === 11000) {
        errorMessages.email = 'An account for this email already exists. Please login.';
    }

    // Incorrect email or password

    if (error.message === "Invalid email or username") {
        errorMessages.email = "Invalid email or username";
    }

    if (error.message === "Invalid password") {
        errorMessages.password = "Invalid password";
    }

    return errorMessages;
    // next();
};

const sendEmail = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject,
            html
        });
    } catch (error) {
        console.log(error);
    }
}

const maxAge = 1 * 24 * 60 * 60;

const createAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });

}

const signup = async (req, res) => {
    try {

        const { username, email, password } = req.body;

        // Check for existing username
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Create new user

        const newUser = await new User({ username, email, password });
        await newUser.save();

        const verifyUserToken = new Token({ userId: newUser._id, token: crypto.randomBytes(16).toString('hex') });

        await verifyUserToken.save();


        // Setup and send verification email

        const verificationLink = `${process.env.BASE_URL}/users/verify/${verifyUserToken.token}`;
        let emailContent = fs.readFileSync("./emailTemplates/verifyEmail.html", "utf8");
        emailContent = emailContent.replace("{{verificationLink}}", verificationLink);
        emailContent = emailContent.replace("{{username}}", username);

        await sendEmail(email, "Kindly verify your email", emailContent);

        res.status(201).json({ message: "User Created" });
    } catch (error) {

        const errors = handleValidationErrors(error);


        res.status(400).json({ errors });
    }
};

const verifyUser = async (req, res) => {
    try {
        const token = await Token.findOne({ token: req.params.token });
        if (!token) {
            return res.status(404).json({ message: "Invalid Link" });
        }

        const user = await User.findOneAndUpdate({ _id: token.userId }, { $set: { verified: true } });
        await Token.findByIdAndDelete(token._id);

        res.status(200).json({ user: user.email, message: "User Verified" })
    } catch (error) {
        console.log(error);
    }
}

const login = async (req, res) => {

    try {
        const { identifier, password } = req.body;


        // Call Static method on User model
        const user = await User.login(identifier, password);

        if (!user.verified) {
            return res.status(400).json({ message: "Please verify your email" });
        }

        // Create JWT token

        accessToken = createAccessToken(user._id);

        // Send JWT token as cookie to frontend
        res.cookie('jwt', accessToken, { httpOnly: true, maxAge: maxAge * 1000 });

        res.status(200).json({ user });

    } catch (error) {
        const errors = handleValidationErrors(error);
        res.status(400).json({errors})
    }


    // accessToken = createAccessToken(newUser._id);
    // res.cookie('jwt', accessToken, { httpOnly: true, maxAge: maxAge * 1000 });
};

const logout = (req, res) => {

    res.cookie('jwt', '', { maxAge: 1 })
    res.send("User Logged out");
};

module.exports = {
    signup,
    login,
    logout,
    verifyUser
};
