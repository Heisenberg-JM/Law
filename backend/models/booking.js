const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    placeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    phno:{
        type: Number,
        required: true,
        minlength:10,
        maxlength:10
    },
    address:{
        type: String,
        required: true
    },
    startSlot: {
        type: Date,
        // required: true
    },
    endSlot: {
        type: Date,
        // required: true
    },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;