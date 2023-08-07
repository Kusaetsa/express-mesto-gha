const { ERROR_BAD_REQUEST } = require('../utills/statusCodes');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_BAD_REQUEST;
  }
}

module.exports = BadRequestError;
