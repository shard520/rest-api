const { Router } = require('express');
const { addUser } = require('./user.controllers');
const userRouter = Router();

userRouter.post('/user', addUser);

module.exports = userRouter;
