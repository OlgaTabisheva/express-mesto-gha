// const path=require('path')
// const fs = require('fs').promises
const express = require('express')
const user = require('../models/user');
const mongoose = require('mongoose');
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
  if (!mongoose.Types.ObjectId.isValid(req.params.userId))
  {return res.status(400).send({message: 'Некорректный ID'})}
  user.findById(req.params.userId)
    .then(user => res.send({data: user}))
    .catch((err) => {return res.status(500).send({message: 'Ошибка сервера'})
    })
};

const patchUser = (req, res) => {
  const {name, about} = req.body
  user.findByIdAndUpdate(req.user._id, {name, about})
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
  const {avatar} = req.body
  user.findByIdAndUpdate(req.user._id, {avatar})
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


