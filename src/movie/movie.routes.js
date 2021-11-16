const { Router } = require('express');
const {
  addMovie,
  listMovies,
  updateMovie,
  deleteMovie,
} = require('./movie.controllers');
const movieRouter = Router();

movieRouter.post('/movie', addMovie);

movieRouter.get('/movie', listMovies);

movieRouter.patch('/movie', updateMovie);

movieRouter.delete('/movie', deleteMovie);

module.exports = movieRouter;
