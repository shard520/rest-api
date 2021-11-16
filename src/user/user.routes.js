const { Router } = require('express');
const {
  addUser,
  listUsers,
  updateUser,
  deleteUser,
  login,
} = require('./user.controllers');
const { hashPassword, comparePasswords, tokenAuth } = require('../middleware');
const userRouter = Router();

userRouter.post('/user', hashPassword, addUser);
userRouter.post('/login', comparePasswords, login);
userRouter.get('/token', tokenAuth, login);

userRouter.get('/user', listUsers);

userRouter.patch('/user', updateUser);

userRouter.delete('/user', deleteUser);

module.exports = userRouter;
