const express = require('express');
const {getAllBooks,getBook,createBook,deleteBook,updateBook}=require('../controller/BookController');
const bookRouter = express.Router();

bookRouter.route('/')
    .get(getAllBooks)
    .post(createBook);

bookRouter.route('/:id')
    .get(getBook)
    .patch(updateBook)
    .delete(deleteBook);

module.exports = bookRouter;