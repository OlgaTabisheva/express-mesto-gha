const validator = require('validator');

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    select: false,
  },
});

userSchema.path('avatar').validate((val) => {
  const urlRegex = /(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.([^\d][^\d])))(:\d{2,5})?((\/.+)+)?\/?#?/;
  return urlRegex.test(val);
}, 'Invalid URL.');

userSchema.path('email').validate((val) => validator.isEmail(val), 'Invalid email.');

module.exports = mongoose.model('user', userSchema);
