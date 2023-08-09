const { ERROR_INTERNAL_SERVER } = require('../utills/statusCodes');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || ERROR_INTERNAL_SERVER;
  const message = statusCode === ERROR_INTERNAL_SERVER ? 'Произошла ошибка сервера' : err.message;

  res.status(statusCode).send({ message });
  next();
};

module.exports = errorHandler;
