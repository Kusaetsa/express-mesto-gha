const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  OK,
  CREATED,
  ERROR_BAD_REQUEST,
  ERROR_UNAUTHORIZATE,
  ERROR_NOT_FOUND,
  CONFLICT,
  ERROR_INTERNAL_SERVER,
} = require('../utills/statusCodes');
const { SECRET_KEY } = require('../utills/secret_key');

function getUsers(req, res) {
  return User.find({})
    .then((users) => res.status(OK).send(users))
    .catch((err) => res.status(ERROR_INTERNAL_SERVER).send({ message: `Ошибка по умолчанию ${err}` }));
}

function getUser(req, res) {
  return User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Пользователь по указанному id не найден' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
    });
}

function createUser(req, res) {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, name, about, avatar, password: hash,
    }))
    .then((user) => {
      const sendUser = {
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      };
      res.status(CREATED).send(sendUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(CONFLICT).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } if (err.code === 11000) {
        res.status(CONFLICT).send({ message: 'Пользователь с таким email уже существует' });
        return;
      }

      res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
    });
}

function updateUserInfo(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.owner, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
    });
}

function updateUserAvatar(req, res) {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
    });
}

function login(req, res) {
  const { email, password } = req.body;
  return User.findAndCheckUser(email, password)
    .then((user) => {
      const payload = { _id: user._id };
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
      res.status(OK).send({ token });
    })
    .catch((err) => {
      res.status(ERROR_UNAUTHORIZATE).send({ message: `Ошибка авторизации ${err}` });
    });
}

function getCurrentUser(req, res) {
  return User.findById(req.user)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Пользователь по указанному id не найден' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
  getCurrentUser,
};
