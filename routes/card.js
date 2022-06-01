const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().uri(),
  }),
}), createCards);
router.delete('/cards/:cardId', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    postId: Joi.string().alphanum().length(24),
  }),
  headers: Joi.object().keys({
    // валидируем заголовки
  }),
  query: Joi.object().keys({
    // валидируем query
  }).unknown(true),
}), deleteCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);
module.exports.cardRouter = router;
