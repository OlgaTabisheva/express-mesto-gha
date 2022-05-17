const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link:{
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId, // имя — это строка
    ref: 'owner',
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле

  },
  likes:{
    type: mongoose.Schema.Types.ObjectId, // имя — это строка
    ref: 'likes',
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    default: [],
  },
  createdAt:{
    type: Date, // имя — это строка
    default: Date.now

  }
});
module.exports = mongoose.model('card', cardSchema);