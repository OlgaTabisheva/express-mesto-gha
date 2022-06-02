const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const user = require('../models/user');

const getUsers = (req, res) => {
  user.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      if (err.user === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',');
        return res.status(400).send({ message: `${fields} Пользователь не найден` });
      }
      return res.status(500).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Ошибка на стороне пользователя. Возможно емаил и пароль введены некорректно' });
  }
  return bcrypt.hash(req.body.password, 10)
    .then((hash) => user.create({
      name,
      about,
      avatar,
      email: req.body.email,
      password: hash, // записываем хеш в базу
    }))
    .then((newUser) => {
      const outUser = {
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        _id: newUser._id,
      };
      res.send({ data: outUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',');
        return res.status(400).send({ message: `${fields} не корректно` });
      }
      if (err.code === 11000) {
        return res.status(409).send({ message: 'пользователь существует' });
      }
      return res.status(500).send({ message: err.message });
    });
};

const getUser = (req, res) => {
  user.findById(req.params.userId)
    .then((newUser) => {
      if (newUser === null) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: newUser });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

const getUserMe = (req, res) => {
  const { _id } = req.user;
  user.find(
    { _id },
  )
    .then((newUser) => {
      res.send({ data: newUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.about === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',');
        return res.status(400).send({ message: `${fields} Ошибка` });
      }
      return res.status(500).send({ message: err.message });
    });
};

const patchUser = (req, res) => {
  const { name, about } = req.body;
  user.findByIdAndUpdate(
    req.user,
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
      return res.status(500).send({ message: err.message });
    });
};

const patchAvatar = (req, res) => {
  const { avatar } = req.body;
  user.findByIdAndUpdate(
    req.user,
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
      return res.status(500).send({ message: err.message });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  user.findOne({ email }).select('+password')
    .then((userM) => {
      if (!userM) {
        // перейдём в .catch, отклонив промис
        return Promise.reject(new Error('Что-то не так с почтой или паролем!'));
      }
      if (bcrypt.compare(password, userM.password)) {
        return res.send({
          token: jwt.sign({ _id: userM._id }, 'some-secret-key', {
            expiresIn: '7d',
          }),
        });
      }
      return res.status(401).send({ message: 'неверный пользователь или пароль' });
    })
    .catch((err) => next(err));
};

module.exports = {
  getUser,
  createUser,
  getUsers,
  patchUser,
  patchAvatar,
  login,
  getUserMe,
};
