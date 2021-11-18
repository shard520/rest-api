const { Router } = require('express');
const { tokenAuth } = require('../middleware');
const {
  addMovie,
  listMovies,
  findMovie,
  updateMovie,
  deleteMovie,
  findByActor,
  findByGenre,
  findByRating,
} = require('./movie.controllers');
const movieRouter = Router();

movieRouter.post('/movie', tokenAuth, addMovie);
movieRouter.post('/findMovie', findMovie);
movieRouter.post('/findByActor', findByActor);
movieRouter.post('/findByGenre', findByGenre);
movieRouter.post('/findByRating', findByRating);

movieRouter.get('/movie', listMovies);

movieRouter.patch('/movie', tokenAuth, updateMovie);

movieRouter.delete('/movie', tokenAuth, deleteMovie);

module.exports = movieRouter;
