const express = require('express');
const {
    getAllReservation,
    createReservation,
    getReservation,
    updateReservation,
    deleteReservation
} = require("../Controller/reservationController");

const reservationRouter = express.Router({ mergeParams: true });

reservationRouter.get('/', getAllReservation);

reservationRouter.route('/')
    .post(createReservation);

reservationRouter.route('/:id')
    .get(getReservation)
    .patch(updateReservation)
    .delete(deleteReservation);

module.exports = reservationRouter;