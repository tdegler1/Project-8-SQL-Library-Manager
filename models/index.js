// This code configures the Sequelize instance and requires (loads) the Book model defined in the models/book.js file.

// Create a database instance connected to a SQLite database (in this case, library.db)
const Sequelize = require('sequelize');
// Instantiate Sequelize by initializing a variable named sequelize to the Sequelize() constructor with parameters to specify the version of SQL and the database.
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db',
  logging: false // disable logging to the console when running.
});

const db = {
  sequelize,
  Sequelize,
  models: {},
};

db.models.Book = require('../models/book.js') (sequelize);

module.exports = db;