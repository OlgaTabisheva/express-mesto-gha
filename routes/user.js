const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, patchUser, patchAvatar, getUsers, getUserMe,
} = require('../controllers/users');

router.get('/users/me', celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
  }),
}), getUserMe);
router.get('/users/:userId', getUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    userId: Joi.number().integer().min(10),
  }),
}), patchUser);
router.get('/users', getUsers);
router.patch('/users/me/avatar', patchAvatar);

module.exports.userRouter = router;
