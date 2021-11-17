const { Router } = require('express');
const { tokenAuth } = require('../middleware');
const {
  addGenre,
  listGenres,
  findGenre,
  updateGenre,
  deleteGenre,
} = require('./genre.controllers');
const genreRouter = Router();

genreRouter.post('/genre', tokenAuth, addGenre);
genreRouter.post('/findGenre', findGenre);

genreRouter.get('/genre', listGenres);

genreRouter.patch('/genre', tokenAuth, updateGenre);

genreRouter.delete('/genre', tokenAuth, deleteGenre);

module.exports = genreRouter;
