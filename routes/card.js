
const router = require('express').Router()
const  {getCards, createCards, deleteCard} = require("../controllers/cards")

router.get('/cards', getCards);
router.post('/cards', createCards);
router.delete('/cards/:cardId',deleteCard);
router.put('/cards/:cardId/like',);
router.delete('/cards/:cardId/likes',);

module.exports.cardRouter = router



