const card = require('../models/card');


const getCards= (req, res) => {
  card.find({})
    .then(cards => res.send({ data: cards }))

  if (!card) {
    return res.status(404).send({message: 'Карточка не найдена'})
  }
}

  const createCards = (req, res) => {
    const {name,link} = req.body
    const owner = req.user._id
    console.log(owner)
    if(!name || !link ){
      return res.status(400).send({ message: "Ошибка на стороне пользователя. Данные карточки заполненны не полностью" })
    }
    card.create({ name, link, owner})
      .then(card => res.send({ data: card }))
      .catch((err) => res.status(500).send({ message: 'Произошла ошибка'+err }));
  }

    const deleteCard = (req, res) => {
      card.findByIdAndRemove(req.params.id)
          .then(card => res.send({ data: card }))
          .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));

  }

module.exports = {
  getCards,
  createCards,
  deleteCard
}

