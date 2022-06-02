const mongoose = require('mongoose');
const card = require('../models/card');

const getCards = (req, res) => {
  card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

const createCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user;
  if (!name || !link) {
    return res.status(400).send({ message: 'Ошибка на стороне пользователя. Данные карточки заполненны не полностью' });
  }
  return card.create({ name, link, owner })
    .then((newCard) => res.send({ data: newCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',');
        return res.status(400).send({ message: `${fields} не корректно` });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const deleteCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    return res.status(400).send({ message: 'Некорректный ID' });
  }
  return card.findByIdAndRemove(req.params.cardId)
    .then((newCard) => {
      if (newCard === null) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.send({ data: newCard });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

const likeCard = (req, res) => card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  {},
)
  .then((likes) => {
    if (likes === null) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    return res.send({ data: likes });
  })
  .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));

const dislikeCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    return res.status(400).send({ message: 'Некорректный ID' });
  }
  return card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {},
  )
    .then((likes) => {
      if (likes === null) {
        return res.status(404).send({ message: 'Карточка не найдена' });
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
