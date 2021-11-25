const { Router } = require('express');
const {
  addUser,
  updateUser,
  deleteUser,
  login,
} = require('./user.controllers');
const { hashPassword, comparePasswords, tokenAuth } = require('../middleware');
const userRouter = Router();

userRouter.post('/user', hashPassword, addUser);
userRouter.post('/login', comparePasswords, login);
userRouter.get('/token', tokenAuth, login);

userRouter.patch('/user', tokenAuth, updateUser);

userRouter.delete('/user', tokenAuth, deleteUser);

module.exports = userRouter;
