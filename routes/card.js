const path=require('path')
const fs = require('fs').promises
const cards = require('../cards-data.json')
const routerCard = require('express').Router()

routerCard.post('/cards', );
routerCard.delete('/cards/:cardId',);
routerCard.put('/cards/:cardId/like',);
routerCard.delete('/cards/:cardId/likes',);

routerCard.get ('/cards',(req, res) => {
  const cardId = req.param.id
  const card = cards.find(cards.id === +cardId)
  if (!card) {
    return res.status(404).send({message: 'Карточка не найдена'})
  }
});

routerCard.post('/cards',(req, res) => {
    const {name, link, owner} = req.body
    if (!name || !link || !owner) {
      return res.status(400).send({message: "Ошибка на стороне пользователя. Возможно данные карточки введены некорректно"})
    }

} );

routerCard.delete('/cards/:cardId',(req,res)=>{
  routerCard.delete('/:id', (req, res) => {
    card.findByIdAndRemove(req.params.id)
      .then(card => res.send({ data: card }))
      .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
  });
});

module.exports.userRouter = routerCard



/*
Другие роуты карточек и пользователя
Реализуйте ещё четыре роута:
  PATCH /users/me — обновляет профиль
PATCH /users/me/avatar — обновляет аватар
PUT /cards/:cardId/likes — поставить лайк карточке
DELETE /cards/:cardId/likes — убрать лайк с карточки
В каждом роуте понадобится _id пользователя, совершающего операцию. Получайте его из req.user._id.*/
