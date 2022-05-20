const card = require('../models/card');
const mongoose = require('mongoose');

const getCards = (req, res) => {
  card.find({})
    .then(cards => res.send({data: cards}))
  if (!card) {
    return res.status(404).send({message: 'Карточка не найдена'})
  }
}

const createCards = (req, res) => {
  const {name, link} = req.body
  const owner = req.user._id
  console.log(owner)
  if (!name || !link) {
    return res.status(400).send({message: "Ошибка на стороне пользователя. Данные карточки заполненны не полностью"})
  }
  card.create({name, link, owner})
    .then(card => res.send({data: card}))
    .catch(err => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',')
        return res.status(400).send({message: `${fields} не корректно`})
      }
      res.status(500).send({message: 'Ошибка сервера'});
    })
}

const deleteCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId || req.params.userId)) {
    return res.status(400).send({message: 'Некорректный ID'})
  }
  card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        return res.status(404).send({message: 'Карточка не найдена'})
      }
      res.send({data: card})
    })
    .catch(err => res.status(500).send({message: 'Ошибка сервера'}));
}

const likeCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId || req.params.userId)) {
    return res.status(400).send({message: 'Некорректный ID'})
  }
  card.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: req.user._id}},
    {},)
    .then((likes) => {
      if (likes === null) {
        return res.status(404).send({message: 'Карточка не найдена'})
      }
      res.send({data: likes})

    })
    .catch(err => res.status(500).send({message: 'Ошибка сервера'}));
}

const dislikeCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId || req.params.userId)) {
    return res.status(400).send({message: 'Некорректный ID'})
  }
  card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},
    {},)
    .then((likes) => {
      if (likes === null) {
        return res.status(404).send({message: 'Карточка не найдена'})
      }
      res.send({data: likes})

    })
    .catch(err => res.status(500).send({message: 'Ошибка сервера'}));
}

module.exports = {
  getCards,
  createCards,
  deleteCard,
  likeCard,
  dislikeCard
}
