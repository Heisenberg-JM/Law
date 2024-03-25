const express = require('express');
const Booking = require('../models/booking');
const Place = require('../models/places');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();
const twilio = require('twilio');
require('dotenv').config();
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
console.log(TWILIO_ACCOUNT_SID);
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Route to book a slot in a place for a specific period
router.post('/bookings',checkAuth, async (req, res) => {
    try {
        const {placeId, phno, address, startSlot, endSlot } = req.body;
        const userId = req.userData.userId;
        // Check if the user has already booked the slots for the specified period
        const existingBooking = await Booking.findOne({ userId });
        if (existingBooking) {
            return res.status(400).json({ message: 'You have already booked a slot' });
        }

        const place = await Place.findById(placeId);
        
        // Check if the place has available slots
        if (!place || place.slot === 0) {
            return res.status(400).json({ message: 'No available slots for this place.' });
        }

        const newBooking = new Booking({ userId, placeId, phno, address, startSlot, endSlot });
        await newBooking.save();
        const phoneNumber = `+91${phno}`;
        client.messages
            .create({
                body: 'Your booking has been confirmed.',
                from: TWILIO_PHONE_NUMBER, // Twilio phone number
                to: phoneNumber // Indian phone number
            })
            .then(message => console.log(message.sid))
            .catch(error => console.error(error));
        place.slot -= 1;
        await place.save();

        res.status(201).json(newBooking);
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
});


// Route to get bookings of a user
router.get('/bookings/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(userId);
        const userBookings = await Booking.find({ userId }).populate('placeId');
        // console.log(userBookings);
        res.status(200).json(userBookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get bookings of a staff member (place)
// Route to get bookings of a place assigned to a staff member
router.get('/bookings/place/:staffId', async (req, res) => {
    try {
        const staffId = req.params.staffId;
        const place = await Place.findOne({ staff: staffId });
        if (!place) {
            return res.status(404).json({ message: 'No place assigned to this staff member' });
        }

        const placeBookings = await Booking.find({ placeId: place._id }).populate('userId').populate('placeId');
        // console.log(placeBookings)
        res.status(200).json(placeBookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Route to get places assigned to a staff member
router.get('/places/staff/:staffId', async (req, res) => {
    try {
        const staffId = req.params.staffId;
        const assignedPlaces = await Place.find({ staff: staffId });
        res.status(200).json(assignedPlaces);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;