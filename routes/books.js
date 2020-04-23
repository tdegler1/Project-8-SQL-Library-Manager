const express = require('express');
const router = express.Router();
const Book = require('../models').models.Book;

/* Asynchronous handler function to wrap each route. */
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        res.status(500).send(error);
      }
    }
  }

/* Display the full list of books. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll({ order: [['createdAt', 'DESC']]});
  res.render("index", {books, title: "All Books"})
}));

/* Display the Create New Book form. */
router.get('/new', asyncHandler(async (req, res) =>{
    res.render("new-book", { book: {}, title: "New Book"});
})) ;

/* Create a new book. */
router.post('/new', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect("/books/");
    } catch (error){
        if(error.name === "SequelizeValidationError") { // checking the error
            book = await Book.build(req.body);
            res.render("new-book", { book, errors: error.errors, title: "New Book" })
        } else {
            throw error; // error caught in the asyncHandler's catch block
        } 
    }
}));

/* Display individual book. */
router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("update-book", { book, title: "Update Book" });  
  } else {
    res.render("error", { title: "Server Error"});
  }
})); 

/* Update a book. */
router.post('/:id', asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if(book) {
        await book.update(req.body);
        res.redirect("/books/"); 
      } else {
        res.sendStatus(404);
      }
    } catch (error){
        if(error.name === "SequelizeValidationError") { // checking the error
            book = await Book.build(req.body);
            book.id = req.params.id; // make sure correct book gets updated
            res.render("update-book", { book, errors: error.errors, title: "Update Book" })
        } else {
            throw error; // error caught in the asyncHandler's catch block
        } 
    }
}));

/* Delete a book. */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/books/");
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;
