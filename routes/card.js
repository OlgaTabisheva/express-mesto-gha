const router = require('express').Router()
const {getCards, createCards, deleteCard, likeCard, dislikeCard} = require("../controllers/cards")

router.get('/cards', getCards);
router.post('/cards', createCards);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/like', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports.cardRouter = router



