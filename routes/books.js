const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

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

/* GET full list of books. */
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render("index", {books})
}));

module.exports = router;
