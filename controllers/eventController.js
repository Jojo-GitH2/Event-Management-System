const Event = require("../models/Event");
const User = require("../models/User");

const { handleEventErrors } = require("../utils");

const createEvent = async (req, res) => {
    try {
        const { title, description, date, time, location } = req.body;
        const organizer = req.userId;
        const event = await new Event({
            title,
            description,
            date,
            location,
            organizer,
            time
        });
        await event.participants.push(organizer);
        await event.save();

        // For convenience, we would like to return the link to the event

        const rsvpLink = `${process.env.BASE_URL}/events/rsvp?eventId=${event._id}`;
        const eventLink = `${process.env.BASE_URL}/events/${event._id}`;

        res.status(201).json({ eventLink, rsvpLink });
    } catch (error) {
        const errors = handleEventErrors(error);
        // console.log(error);
        res.status(400).json({ errors });
    }
};

// Get all Events

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();

        // console.log(events);

        const eventsArray = [];

        // For Each of the events, we would like to return the number of participants, the organizer's name, and the event details

        for (const event of events) {
            const participantsSize = event.participants.length;
            let organizer = await User.findById(event.organizer);
            if (!organizer) {
                organizer = { username: "Unknown" };
            }
            eventsArray.push({
                organizer: organizer.username,
                participantsSize,
                event: {
                    title: event.title,
                    description: event.description,
                    date: event.date,
                    location: event.location,
                    time: event.time
                },
            });
        }

        res.status(200).json({
            events: eventsArray,
        });
    } catch (error) {
        console.log(error);
    }
};

// RSVP functionality for users

const rsvpEvent = async (req, res) => {
    try {
        const eventId = req.query.eventId;
        const userId = req.userId;
        // console.log(eventId)

        const event = await Event.findById(eventId);

        if (event.participants.includes(userId)) {
            return res
                .status(400)
                .json({ message: "You have already registered for this event." });
        }
        // console.log(event);

        event.participants.push(userId);
        await event.save();

        res
            .status(200)
            .json({ message: "You have successfully registered for this event." });
    } catch (error) {
        // console.log(error.message);
        const errors = handleEventErrors(error);
        res.status(400).json({ errors });
    }
};

// Get Event by ID

const getEventById = async (req, res) => {
    const eventId = req.params.eventId;

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        // console.log(event);

        // Number of participants
        const participantsSize = event.participants.length;

        // Organizer's Name
        const organizer = await User.findById(event.organizer);

        res.status(200).json({
            organizer: organizer.username,
            participantsSize,
            event: {
                title: event.title,
                description: event.description,
                date: event.date,
                location: event.location,
                time: event.time
            },
        });
    } catch (error) {
        console.log(error);
    }
};

const updateEvent = async (req, res) => {
    try {

        const eventId = req.params.eventId;
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const organizerMain = event.organizer;

        const organizer = req.userId;

        // console.log(eventId, organizerMain, organizer);
        if (organizer != organizerMain) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        const { title, description, date, time, location } = req.body;

        const newEvent = await Event.findByIdAndUpdate(eventId, {
            title,
            description,
            date,
            time,
            location
        }, { new: true });
        
        res.status(200).json({ newEvent });
        
        
        
    } catch (error) {
        console.log(error);
        
    }
}

const deleteOneEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId);
        const organizerMain = event.organizer;

        const organizer = req.userId;

        // console.log(eventId, organizerMain, organizer);

        if (organizer != organizerMain) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await Event.findByIdAndDelete(eventId);
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.log(error);
    }   


}

const deleteAllEvents = async (req, res) => {
    try {
        await Event.deleteMany();
        res.status(200).json({ message: "All events deleted successfully" });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createEvent,
    getAllEvents,
    rsvpEvent,
    getEventById,
    updateEvent,
    deleteOneEvent,
    deleteAllEvents

};
