const express = require('express')
const {userRouter} = require('./routes/user')
const {cardRouter} = require('./routes/card')

const app = express()

const {PORT = 3000} = process.env


app.use(express.json())

app.use((req, res, next) => {
  req.user = {
    _id: '62852af259406ccd0b066c10' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/', userRouter)
app.use('/', cardRouter)
const mongoose = require('mongoose');
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,

});


app.listen(PORT, () => {
  console.log('Сервер запущен')
});



