const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleValidationErrors = (error) => {
    let errorMessages = {};

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

    return errorMessages;
    // next();
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });

}

const signup = async (req, res) => {
    try {
        // if (!username || !email || !password) {
        //     return res.status(400).json({ message: "Please enter all fields" });
        // }
        const { username, email, password } = req.body;

        // Check for existing username
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Create new user

        const newUser = await new User({ username, email, password });
        await newUser.save();

        const token = createToken(newUser._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })

        res.status(201).json({ user: newUser._id });
    } catch (error) {
        // Checks for duplicate key error, i.e., email already exists
        // if (error.code == 11000) {
        //     return res
        //         .status(400)
        //         .json("An account for this email already exists. Please login.");
        // }
        // console.error(error);
        // console.log(error.code);
        // res.status(500).json(error.message);
        const errors = handleValidationErrors(error);

        // console.log(Object.values(error.errors))
        // console.log(error.message);
        res.status(400).json({ errors });
    }
};

const login = async (req, res) => {
    const { username, email, password } = req.body;
};

const logout = (req, res) => {
    res.send("User Logged out");
};

module.exports = {
    signup,
    login,
    logout,
};
