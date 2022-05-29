const mongoose = require('mongoose');
const express = require('express');
const { userRouter } = require('./routes/user');
const { cardRouter } = require('./routes/card');
const auth = require('./middlewares/auth');
const app = express();
const { PORT = 3000 } = process.env;
const { createUser, login } = require('./controllers/users');


app.use(express.json());

/*
app.use((req, res, next) => {
  req.user = {
    _id: '62852af259406ccd0b066c10', // вставьте сюда _id созданного в предыдущем пункте пользоват
  };
  next();
});
*/

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);

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
