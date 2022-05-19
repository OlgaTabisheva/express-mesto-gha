const card = require('../models/card');


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
      return res.status(400).send({message: `${fields} is not correct`})
    }
    res.status(500).send({message: 'Произошла ошибка'});
  })
}

const deleteCard = (req, res) => {
  card.findByIdAndRemove(req.params.cardId)
    .then(card => res.send({data: card}))
    .catch(err => res.status(500).send({message: 'Произошла ошибка'}));
}

const likeCard = (req, res) => {
  console.log(req.user._id)
  card.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: req.user._id}}, // добавить _id в массив, если его там нет
    {new: true},)
  next
}
const dislikeCard = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },)
}


module.exports = {
  getCards,
  createCards,
  deleteCard,
  likeCard,
  dislikeCard
}

