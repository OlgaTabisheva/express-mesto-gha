const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, patchUser, patchAvatar, getUsers, getUserMe,
} = require('../controllers/users');

router.get('/users/me', getUserMe);
router.get('/users/:userId', getUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), patchUser);
router.get('/users', getUsers);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri(),
  }),
}), patchAvatar);

module.exports.userRouter = router;
