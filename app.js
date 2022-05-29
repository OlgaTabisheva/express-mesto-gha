const mongoose = require('mongoose');
const express = require('express');
const { userRouter } = require('./routes/user');
const { cardRouter } = require('./routes/card');
const app = express();
const { PORT = 3000 } = process.env;
const {createUser, login, getUsers} = require('./controllers/users');
const auth = require('./middlewares/auth');

/*
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '62852af259406ccd0b066c10', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});*/

app.post('/signin', login);
app.post('/signup', createUser);
app.get('/users', getUsers);
app.use('/', userRouter);
app.use('/', cardRouter);
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
