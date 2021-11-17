const { Router } = require('express');
const { tokenAuth } = require('../middleware');
const {
  addMovie,
  // listMovies,
  // updateMovie,
  // deleteMovie,
} = require('./movie.controllers');
const movieRouter = Router();

movieRouter.post('/movie', tokenAuth, addMovie);

// movieRouter.get('/movie', listMovies);

// movieRouter.patch('/movie', updateMovie);

// movieRouter.delete('/movie', deleteMovie);

module.exports = movieRouter;
