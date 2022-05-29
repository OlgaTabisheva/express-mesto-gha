const mongoose = require('mongoose');
const user = require('../models/user');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');

const getUsers = (req, res) => {

  user.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      if (err.user === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',');
        return res.status(400).send({ message: `${fields} Пользователь не найден` });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Ошибка на стороне пользователя. Возможно емаил и пароль введены некорректно' });
  }
  bcrypt.hash(req.body.password, 10)
    .then(hash => user.create({
      name,
      about,
      avatar,
      email: req.body.email,
      password: hash, // записываем хеш в базу
    }))
    .then((newUser) => res.send({ data: newUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',');
        return res.status(400).send({ message: `${fields} не корректно` });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const getUser = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).send({ message: 'Некорректный ID' });
  }
  return user.findById(req.params.userId)
    .then((newUser) => {
      if (newUser === null) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: newUser });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

const patchUser = (req, res) => {
  const { name, about } = req.body;
  user.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((newUser) => {
      res.send({ data: newUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.about === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',');
        return res.status(400).send({ message: `${fields} Ошибка` });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const patchAvatar = (req, res) => {
  const { avatar } = req.body;
  user.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((newUser) => res.send({ data: newUser }))
    .catch((err) => {
      if (err.avatar === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',');
        return res.status(400).send({ message: `${fields} не корректно` });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const login = (req, res)  =>{
  console.log(req.body)
  const { email, password } = req.body;

  return user.find({"email":email, "password": password})
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id },  "012345",{
          expiresIn: '7d'
        } )
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
}


  module.exports = {
  getUser,
  createUser,
  getUsers,
  patchUser,
  patchAvatar,
  login
};
