const Books = require('../Model/bookModel');
const Reservation = require('../Model/reservationModel');
const mongoose = require('mongoose');

const getAllBooks = async (req, res, next) => {
    try {
        const books = await Books.find();
        res.status(200).json({
            message: 'Books found',
            data: books
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching books',
            error: err.message
        });
    }
}

const getBook = async (req, res, next) => {
    try {
        const book = await Books.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        const currentDate = new Date();
        const activeReservation = await Reservation.findOne({
            bookId: req.params.id,
            reservedUntil: { $gt: currentDate }
        });

        const bookResponse = book.toObject();
        if (activeReservation) {
            bookResponse.loanedUntil = activeReservation.reservedUntil;
            bookResponse.reservedBy = activeReservation.reservedBy;
        } else {
            bookResponse.loanedUntil = null;
            bookResponse.reservedBy = null;
        }

        res.status(200).json({
            message: 'Book found',
            data: bookResponse
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching book',
            error: err.message
        });
    }
}

const createBook = async (req, res, next) => {
    try {
        const createdBook = await Books.create(req.body);
        res.status(201).json({
            message: 'Book created',
            data: createdBook
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            message: 'Error creating book',
            error: err.message
        });
    }
}

const deleteBook = async (req, res, next) => {
    try {
        const deletedBook = await Books.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }
        res.status(200).json({
            message: 'Book deleted',
            data: null
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error deleting book',
            error: err.message
        });
    }
}

const updateBook = async (req, res, next) => {
    try {
        const updatedBook = await Books.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedBook) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }
        res.status(200).json({
            message: 'Book updated',
            data: updatedBook
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error updating book',
            error: err.message
        });
    }
}

module.exports = {
    getAllBooks,
    getBook,
    createBook,
    deleteBook,
    updateBook
};