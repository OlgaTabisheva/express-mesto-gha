const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');


router.get('/cards', getCards);
router.post('/cards',celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.link().required(),

  }),
}), createCards);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);
module.exports.cardRouter = router;
