
const express = require("express");
const router = express.Router();
const { createEvent, getAllEvents, rsvpEvent, getEventById, updateEvent, deleteOneEvent, deleteAllEvents } = require("../controllers/eventController");
const { requireAuth } = require("../middleware/authMiddleware");


router.get("/", getAllEvents);
router.get("/:eventId", getEventById);
router.post("/create-event", requireAuth, createEvent);
router.post("/rsvp?:eventId", requireAuth, rsvpEvent);

router.put("/:eventId", requireAuth, updateEvent);

router.delete("/:eventId", requireAuth, deleteOneEvent);
router.delete("/", requireAuth, deleteAllEvents);


// router.post("/rsvp/?id", requireAuth, rsvpEvent)

module.exports = router;