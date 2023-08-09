const Card = require('../models/card');
const {
  OK,
  CREATED,
  FORBIDDEN,
} = require('../utills/statusCodes');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

function getCards(req, res, next) {
  return Card.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => {
      res.status(CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      return next('Ошибка по умолчанию');
    });
}

function deleteCard(req, res, next) {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Переданы некорректные данные');
      }
      if (req.user._id !== card.owner.toString()) {
        return res.status(FORBIDDEN).send({ message: 'Вы не можете удалять карточки других пользователей' });
      }
      res.status(OK).send(card);
      return Card.findByIdAndRemove(req.params.cardId);
    })
    .catch(next);
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Переданы некорректные данные для постановки/снятии лайка');
      }

      res.status(OK).send(card);
    })
    .catch(next);
}

function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Переданы некорректные данные для постановки/снятии лайка');
      }
      res.status(OK).send(card);
    })
    .catch(next);
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
