const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    bookId: {
        type: String,
        required: [true, 'Book ID is required']
    },
    reservedBy: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long']
    },
    reservedUntil: {
        type: Date,
        required: [true, 'Reservation date is required']
    }
}, {
    timestamps: true
});

reservationSchema.pre('save', function(next) {
    if (this.reservedUntil <= new Date()) {
        next(new Error('Reservation date must be in the future'));
    } else {
        next();
    }
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;