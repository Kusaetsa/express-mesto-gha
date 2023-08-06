const signupRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexLink } = require('../utills/regex_link');

const { createUser } = require('../controllers/users');

signupRouter.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(2).max(30).required()
      .email(),
    password: Joi.string().min(8).max(30).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexLink),
  }),
}), createUser);

module.exports = signupRouter;
