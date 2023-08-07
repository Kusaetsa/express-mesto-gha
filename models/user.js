const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено'],
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректный email адрес',
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Поле "пароль" должно быть заполнено'],
      minlength: [8, 'Минимальная длина пароля - 8 символов'],
      select: false,
    },
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
    },
  },
  { versionKey: false },
);

userSchema.statics.findAndCheckUser = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        console.log('user в функции =>', user);
        return Promise.reject(new NotFoundError('Что-то не так с почтой или паролем1'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new BadRequestError('Что-то не так с почтой или паролем2'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
