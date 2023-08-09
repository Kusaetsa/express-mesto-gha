const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utills/secretKey');
const UnauthorizateError = require('../errors/UnauthorizateError');

function checkAuth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizateError('Ошибка авторизации');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    throw new UnauthorizateError('Ошибка авторизации');
  }

  req.user = payload;
  return next();
}

module.exports = {
  checkAuth,
};
