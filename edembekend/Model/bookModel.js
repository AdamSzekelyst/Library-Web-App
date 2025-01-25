const mongoose =require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    loanedUntil: {
        type: Date
    },
    reservedBy: {
        type: String
    }
});

bookSchema.pre("save",  function () {
    console.log(this);
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;