const Card = require('../models/card');
const {
  OK,
  CREATED,
  FORBIDDEN,
  CONFLICT,
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
        res.status(CONFLICT).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      next('Ошибка по умолчанию');
    });
}

function deleteCard(req, res, next) {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        return res.status(FORBIDDEN).send({ message: 'Вы не можете удалять карточки других пользователей' });
      }
      if (!req.user._id) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      if (!card) {
        throw new BadRequestError('Переданы некорректные данные');
      }
      return res.status(OK).send(card);
    })
    .catch(next);
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      if (!card) {
        throw new BadRequestError('Переданы некорректные данные для постановки/снятии лайка');
      }
      if (!req.user._id) {
        throw new NotFoundError('Карточка с указанным id не найдена');
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
    .orFail()
    .then((card) => {
      if (!card) {
        throw new BadRequestError('Переданы некорректные данные для постановки/снятии лайка');
      }
      if (!req.user._id) {
        throw new NotFoundError('Карточка с указанным id не найдена');
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
