// const path=require('path')
// const fs = require('fs').promises
const user = require('../models/user');

const getUsers = (req, res) => {
  user.find({})
    .then(users => res.send({data: users}))
  //const userId = req.param.userId
  // const user = users.find(users.userId === +userId)
  if (!user) {
    return res.status(404).send({message: 'Пользователь не найден'})
  }
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
        return res.status(400).send({message: 'Произошла ошибка'})
      }
      if (err.about === 'ValidationError') {
        return res.status(400).send({message: 'Произошла ошибка'})
      }
      if (err.avatar === 'ValidationError') {
        return res.status(400).send({message: 'Произошла ошибка'})
      }
      res.status(500).send({message: 'Произошла ошибка'});
    })
}

const getUser = (req, res) => {
  user.findById(req.params.userId)
    .then(user => res.send({data: user}))
    .catch(err => res.status(500).send({message: 'Произошла ошибка'}));
};
const patchUser = (req, res) => {
    user.findByIdAndUpdate(req.user._id, { name:'Кот Манул' })
      .then(user => res.send({ data: user }))
      .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

const patchAvatar = (req, res) => {
  user.findByIdAndUpdate(req.user._id, { avatar: 'https://avatarko.ru/img/kartinka/1/zhivotnye_manul.jpg' })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}


module.exports = {
  getUser,
  createUser,
  getUsers,
  patchUser,
  patchAvatar
}

/* fs.readFile(path.resolve(__dirname,'..','users-data.json'),'utf-8')
   .then(fileContent =>{
     const users = JSON.parse(fileContent)
     users.push({
       userId: users.length,
       name,
       about,
       avatar
     })
     return users
   }).then(users => fs.writeFile(path.resolve(__dirname,'..','users-data.json'),JSON.stringify(users)))
   .then(()=>res.status(201).send({message: 'Пользователь успешно создан'}))
   .catch(()=>res.status(500).send({message: 'ошибка сервера'}))*/
