// routes/places.js
const express = require('express');
const Place = require('../models/places');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

// Route to get all places
router.get('/places',checkAuth, async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to add a new place
router.post('/places', async (req, res) => {
  try {
    const { name,staff, location, contact, Image } = req.body;
    const newPlace = new Place({ name,staff, location, contact, Image });
    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;