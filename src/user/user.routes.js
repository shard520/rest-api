const { Router } = require('express');
const {
  addUser,
  listUsers,
  updateUser,
  deleteUser,
} = require('./user.controllers');
const userRouter = Router();

userRouter.post('/user', addUser);

userRouter.get('/user', listUsers);

userRouter.patch('/user', updateUser);

userRouter.delete('/user', deleteUser);

module.exports = userRouter;
