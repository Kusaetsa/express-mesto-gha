const jwt = require('jsonwebtoken');
const { ERROR_UNAUTHORIZATE } = require('../utills/statusCodes');
const { SECRET_KEY } = require('../utills/secretKey');

function checkAuth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(ERROR_UNAUTHORIZATE).send({ message: 'Ошибка авторизации' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res.status(ERROR_UNAUTHORIZATE).send({ message: 'Ошибка авторизации' });
  }

  req.user = payload;
  return next();
}

module.exports = {
  checkAuth,
};
