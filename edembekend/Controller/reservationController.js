const Book = require("../Model/bookModel");
const Reservation = require("../Model/reservationModel");
const mongoose = require('mongoose');

const getAllReservation = async (req, res, next) => {
    try {
        const reservations = await Reservation.find().sort({ createdAt: -1 });

        const reservationsWithBookDetails = await Promise.all(
            reservations.map(async (reservation) => {
                try {
                    const book = await Book.findById(reservation.bookId);
                    return {
                        ...reservation.toObject(),
                        book: book ? {
                            title: book.title,
                            author: book.author
                        } : null
                    };
                } catch (err) {
                    console.error(`Error fetching book for reservation ${reservation._id}:`, err);
                    return reservation.toObject();
                }
            })
        );

        res.status(200).json({
            message: 'Reservations retrieved successfully',
            data: reservationsWithBookDetails,
        });
    } catch (err) {
        console.error('Error fetching reservations:', err);
        res.status(500).json({
            message: 'Failed to retrieve reservations',
            error: err.message,
        });
    }
};

const getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findOne({
            bookId: req.params.bookId,
        });

        if (!reservation) {
            return res.status(404).json({
                message: 'Reservation not found',
            });
        }

        res.status(200).json({
            message: 'Reservation found',
            data: reservation,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to retrieve the reservation',
            error: err.message,
        });
    }
};

const createReservation = async (req, res, next) => {
    try {
        const bookId = req.baseUrl.split('/')[3];
        console.log('Creating reservation for book:', bookId);

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        const currentDate = new Date();
        const existingReservation = await Reservation.findOne({
            bookId: bookId,
            reservedUntil: { $gt: currentDate }
        });

        if (existingReservation) {
            console.log('Active reservation found:', existingReservation);
            return res.status(400).json({
                message: 'This book is already reserved',
                reservedUntil: existingReservation.reservedUntil
            });
        }

        const reservationDate = new Date(req.body.reservedUntil);
        if (reservationDate <= currentDate) {
            return res.status(400).json({
                message: 'Reservation date must be in the future'
            });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const createdReservation = await Reservation.create([{
                bookId: bookId,
                reservedBy: req.body.reservedBy,
                reservedUntil: reservationDate
            }], { session });

            book.loanedUntil = reservationDate;
            book.reservedBy = req.body.reservedBy;
            await book.save({ session });

            await session.commitTransaction();
            session.endSession();

            res.status(201).json({
                message: 'Reservation created successfully',
                data: {
                    reservation: createdReservation[0],
                    book: book
                }
            });
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            throw err;
        }
    } catch (err) {
        console.error('Error creating reservation:', err);
        res.status(400).json({
            message: 'Failed to create reservation',
            error: err.message
        });
    }
};

const deleteReservation = async (req, res, next) => {
    try {
        const deletedReservation = await Reservation.findOneAndDelete({
            bookId: req.params.bookId,
        });

        if (!deletedReservation) {
            return res.status(404).json({
                message: 'Reservation not found or already deleted',
            });
        }

        res.status(200).json({
            message: 'Reservation deleted successfully',
            data: null,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to delete reservation',
            error: err.message,
        });
    }
};

const updateReservation = async (req, res, next) => {
    try {
        const updatedReservation = await Reservation.findOneAndUpdate(
            {
                _id: req.params.id,
            },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedReservation) {
            return res.status(404).json({
                message: 'Reservation not found or could not be updated',
            });
        }

        res.status(200).json({
            message: 'Reservation updated successfully',
            data: updatedReservation,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to update reservation',
            error: err.message,
        });
    }
};

module.exports = {
    getAllReservation,
    getReservation,
    createReservation,
    updateReservation,
    deleteReservation,
};
