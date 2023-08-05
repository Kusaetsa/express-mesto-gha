const userRouter = require('express').Router();

const {
  getUsers, getUser, updateUserInfo, updateUserAvatar, getCurrentUser,
} = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/me', getCurrentUser);

userRouter.get('/:userId', getUser);

userRouter.patch('/me', updateUserInfo);

userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;
