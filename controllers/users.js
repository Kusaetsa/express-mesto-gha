const User = require('../models/user');
const {
  OK, CREATED, ERROR_BAD_REQUEST, ERROR_NOT_FOUND, ERROR_INTERNAL_SERVER,
} = require('../utills/statusCodes');

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
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
    });
}

function createUser(req, res) {
  return User.create({ ...req.body })
    .then((user) => {
      res.status(CREATED).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
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

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
