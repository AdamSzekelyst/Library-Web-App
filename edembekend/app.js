const express = require("express");
const bookRouter = require("./Router/bookRouter");
const reservationRouter = require("./Router/reservationRouter");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

app.use(express.json());
app.use((req, res, next) => {
    console.log(req.body);
    next();
});

app.use('/api/books', bookRouter);
app.use('/api/books/:bookId/reservation', reservationRouter);
app.use('/api/reservations', reservationRouter);
app.all('*', (req, res, next) => {
    next(new Error('Not Found'));
});

module.exports = {app,express};