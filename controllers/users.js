const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const user = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const RequestErr = require('../errors/request-err');
const NotAutErr = require('../errors/not-aut-err');
const ServerErr = require('../errors/server-err');

const getUsers = (req, res) => {
  user.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      if (err.user === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',');
        throw new RequestErr(`${fields} Пользователь не найден`);
      }
      throw new ServerErr('Ошибка сервера');
    });
};

const createUser = (req, res,next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  console.log('1')
  if (!email || !password) {
    console.log('2')
    return new RequestErr('Ошибка пользователя.емаил и пароль некорректны');
  }
  console.log('3')
  return bcrypt.hash(req.body.password, 10)
    .then((hash) => user.create({
      name,
      about,
      avatar,
      email: req.body.email,
      password: hash, // записываем хеш в базу
    }))
    .then((newUser) => {
      console.log('4')
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
        console.log('5')
        const fields = Object.keys(err.errors).join(',');
        throw new RequestErr(`${fields} не корректно`);
      }
      if (err.code === 11000) {
        console.log('6')
        return res.status(409).send({ message: 'пользователь существует' });
      }
      console.log('7')
      throw new ServerErr('Ошибка сервера');
    }).catch(err => next(err));

};

const getUser = (req, res) => {
  user.findById(req.params.userId)
    .then((newUser) => {
      if (newUser === null) { throw new NotFoundError('Пользователь не найден'); }
      return res.send({ data: newUser });
    });
  throw new ServerErr('Ошибка сервера');
};

const getUserMe = (req, res) => {
  const { _id } = req.user;
  user.findOne(
    { _id },
  )
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.about === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',');
        throw new RequestErr(`${fields} Ошибка`);
      }
      throw new ServerErr('Ошибка сервера');
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
        throw new RequestErr(`${fields} Ошибка`);
      }
      throw new ServerErr('Ошибка сервера');
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
        throw new RequestErr(`${fields} не корректно`);
      }
      throw new ServerErr('Ошибка сервера');
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  user.findOne({ email }).select('+password')
    .then((userM) => {
      if (!userM) {
        // перейдём в .catch, отклонив промис
        throw new NotAutErr('неверный пользователь или пароль');
      }
      if (bcrypt.compare(password, userM.password)) {
        return res.send({
          token: jwt.sign({ _id: userM._id }, 'some-secret-key', {
            expiresIn: '7d',
          }),
        });
      }
      throw new NotAutErr('неверный пользователь или пароль');
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
