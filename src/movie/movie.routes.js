const { Router } = require('express');
const { tokenAuth } = require('../middleware');
const {
  addMovie,
  listMovies,
  findMovie,
  updateMovie,
  deleteMovie,
} = require('./movie.controllers');
const movieRouter = Router();

movieRouter.post('/movie', tokenAuth, addMovie);
movieRouter.post('/findMovie', findMovie);

movieRouter.get('/movie', listMovies);

movieRouter.patch('/movie', tokenAuth, updateMovie);

movieRouter.delete('/movie', tokenAuth, deleteMovie);

module.exports = movieRouter;
