const mongoose = require('mongoose');
const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { userRouter } = require('./routes/user');
const { cardRouter } = require('./routes/card');
const auth = require('./middlewares/auth');

const app = express();
const { PORT = 3000 } = process.env;
const { createUser, login } = require('./controllers/users');

app.use(express.json());
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.([^\d][^\d])))(:\d{2,5})?((\/.+)+)?\/?#?/),

  }),
}), createUser);
app.use('/', auth, userRouter);
app.use('/', auth, cardRouter);

app.use((req, res, next) => {
  next({ message: 'Ошибка', statusCode: 404 });
});
app.use(errors());
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, messageReq } = err;

  res.status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: messageReq,
    });
  next();
});
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.listen(PORT, () => {
  console.log('Сервер запущен');
});
