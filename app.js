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
    password: Joi.string().required().min(5),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),

  }),
}), createUser);
app.use('/', auth, userRouter);
app.use('/', auth, cardRouter);
app.use(errors());

app.use((req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, messageReq } = req;

  res.status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: messageReq,
    });
  next();
});
app.use((req, res) => {
  res.status(404).send({ message: 'Ошибка' });
});
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.listen(PORT, () => {
  console.log('Сервер запущен');
});
