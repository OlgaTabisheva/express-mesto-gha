const mongoose = require('mongoose');
const card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const RequestErr = require('../errors/request-err');

const getCards = (req, res, next) => {
  card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

const createCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user;
  if (!name || !link) {
    throw new RequestErr('Данные карточки заполненны не полностью');
  }
  return card.create({ name, link, owner })
    .then((newCard) => res.send({ data: newCard }))
    .catch((err) => next(err));
};

async function deleteCard(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    throw new RequestErr('Некорректный ID');
  }
  const thisCard = await card.findOne({ _id: req.params.cardId });
  if (thisCard && !thisCard.owner._id.equals(req.user._id)) {
    res.status(403).send({ message: 'Чужая карточка' });
  }
  return card.findByIdAndRemove(req.params.cardId)
    .then((newCard) => {
      if (newCard === null) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: newCard });
    })
    .catch((err) => next(err));
}

const likeCard = (req, res, next) => card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  {},
)
  .then((likes) => {
    if (likes === null) {
      throw new NotFoundError('Карточка не найдена');
    }
    return res.send({ data: likes });
  })
  .catch((err) => next(err));

const dislikeCard = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    throw new RequestErr('Некорректный ID');
  }
  return card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {},
  )
    .then((likes) => {
      if (likes === null) {
        throw new NotFoundError('Карточка не найдена');
      }
      return res.send({ data: likes });
    })
    .catch((err) => next(err));
};

module.exports = {
  getCards,
  createCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
