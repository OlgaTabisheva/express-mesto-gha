const mongoose = require('mongoose');
const card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const RequestErr = require('../errors/request-err');
const ServerErr = require('../errors/server-err');

const getCards = (req, res) => {
  card.find({})
    .then((cards) => res.send({ data: cards }));
  throw new ServerErr('Ошибка сервера');
};

const createCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user;
  if (!name || !link) {
    throw new RequestErr('Данные карточки заполненны не полностью');
  }
  return card.create({ name, link, owner })
    .then((newCard) => res.send({ data: newCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',');
        throw new RequestErr(`${fields} не корректно`);
      }
      throw new ServerErr('Ошибка сервера');
    });
};

async function deleteCard(req, res) {
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
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
}

const likeCard = (req, res) => card.findByIdAndUpdate(
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
  .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));

const dislikeCard = (req, res) => {
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
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

module.exports = {
  getCards,
  createCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
