const router = require('express').Router();
const {
  getUser, patchUser, patchAvatar, getUsers, getUserMe,
} = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');

router.get('/users/me',celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
  }),
}), getUserMe);
router.get('/users/:userId',celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
  }),
}), getUser);
router.patch('/users/me',celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
  }),
}),
patchUser);
router.get('/users',celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
  }),
}), getUsers);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
  }),
}),  patchAvatar);

module.exports.userRouter = router;
