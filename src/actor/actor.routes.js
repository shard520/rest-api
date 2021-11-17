const { Router } = require('express');
const { tokenAuth } = require('../middleware');
const {
  addActor,
  listActors,
  findActor,
  updateActor,
  deleteActor,
} = require('./actor.controllers');
const actorRouter = Router();

actorRouter.post('/actor', tokenAuth, addActor);
actorRouter.post('/findActor', findActor);

actorRouter.get('/actor', listActors);

actorRouter.patch('/actor', tokenAuth, updateActor);

actorRouter.delete('/actor', tokenAuth, deleteActor);

module.exports = actorRouter;
