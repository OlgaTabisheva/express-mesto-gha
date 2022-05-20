const mongoose = require('mongoose');
const user = require('../models/user');

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
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    return res.status(400).send({ message: 'Ошибка на стороне пользователя. Возможно имя, о себе или аватар введены некорректно' });
  }
  return user.create({ name, about, avatar })
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
  const avatar = req.body;
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

module.exports = {
  getUser,
  createUser,
  getUsers,
  patchUser,
  patchAvatar,
};
