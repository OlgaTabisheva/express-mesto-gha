const express = require('express')
const {userRouter} = require('./routes/user')

const app = express()

const {PORT = 3000} = process.env
app.use(express.json())
app.use('/',userRouter)

app.listen(PORT, () =>{
  console.log('Сервер запущен')
});


/*

const mongoose = require('mongoose');
// подключаемся к серве`ру mongo

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

*/



