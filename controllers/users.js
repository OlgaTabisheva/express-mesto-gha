// const path=require('path')
// const fs = require('fs').promises
const user = require('../models/user');

const getUsers = (req, res) => {
  user.find({})
    .then(users => res.status(200).send({data: users}))
    //const userId = req.param.userId
    // const user = users.find(users.userId === +userId)
    .catch((err) => {
      if (err.user === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',')
        return res.status(400).send({message: `${fields} Пользователь не найден`})
      }
      return res.status(500).send({message: 'Ошибка сервера'})
    })
}

const createUser = (req, res) => {
  const {name, about, avatar} = req.body
  if (!name || !about || !avatar) {
    return res.status(400).send({message: "Ошибка на стороне пользователя. Возможно имя, о себе или аватар введены некорректно"})
  }
  user.create({name, about, avatar})
    .then(user => res.send({data: user}))
    .catch(err => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',')
        return res.status(400).send({message: `${fields} is not correct`})
      }
      res.status(500).send({message: 'Произошла ошибка'});
    })
}

const getUser = (req, res) => {
  user.findById(req.params.userId)
    .then(user => res.send({data: user}))
    .catch((err) => {
      if (err.userId === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',')
        return res.status(400).send({message: `${fields} Пользователь не найден`})
      }
      return res.status(500).send({message: 'Ошибка сервера'})
    })
};

const patchUser = (req, res) => {
  user.findByIdAndUpdate(req.user._id, {name: 'Кот Манул'})
    .then(user => res.send({data: user}))
    .catch((err) => {
      if (req.user._id === 'ValidationError'){
        const fields = Object.keys(err.errors).join(',')
        return res.status(400).send({message: `${fields} Пользователь не обновлен`})
      }
      return res.status(500).send({message: 'Ошибка сервера'})
    })
}

const patchAvatar = (req, res) => {
  user.findByIdAndUpdate(req.user._id, {avatar: 'https://avatarko.ru/img/kartinka/1/zhivotnye_manul.jpg'})
    .then(user => res.send({data: user}))
    .catch((err) => {
      if (req.user._id === 'ValidationError'){
        const fields = Object.keys(err.errors).join(',')
        return res.status(400).send({message: `${fields} Пользователь не найден`})
      }
        return res.status(500).send({message: 'Ошибка сервера'})
    })
}



module.exports = {
  getUser,
  createUser,
  getUsers,
  patchUser,
  patchAvatar
}


