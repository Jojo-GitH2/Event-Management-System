const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");



const handleValidationErrors = (error) => {
    let errorMessages = { email: '', password: '', username: '' };

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

    if (error.message === "Invalid Credentials") {
        errorMessages.login = error.message;
        // errorMessages.password = "Invalid Credentials";
    }
    if (error.message === "Enter all fields") {
        errorMessages.login = error.message;
    }

    // if (error.message === "Invalid password") {
    //     errorMessages.password = "Invalid password";
    // }

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


const createAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.MAX_AGE,
    });

}

// Handle Event Errors
const handleEventErrors = (error) => {
    let errorMessages = {
        title: "",
        description: "",
        date: "",
        location: "",
        organizer: "",
    };

    if (error.message.includes("Event validation failed")) {
        Object.values(error.errors).forEach(({ properties }) => {
            errorMessages[properties.path] = properties.message;
        });
    }

    if (error.message.includes("Cast to ObjectId failed")) {
        errorMessages.event = "Invalid Link";
    }

    if (error.message.includes("Event date cannot be in the past")) {
        errorMessages.date = error.message;
    }

    // Duplicate key error
    if (error.code === 11000) {
        errorMessages.title = "An event with this title already exists.";
        errorMessages.organizer = "You already have an event with this title.";
    }

    return errorMessages;
};

module.exports = { handleValidationErrors, sendEmail, createAccessToken, handleEventErrors };  