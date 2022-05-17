const router = require('express').Router()
const path=require('path')
const fs = require('fs').promises
const users = require('../users-data.json')

router.get('/users/:userId', (req, res) => {
  const userId = req.param.userId
  const  user = users.find(users.userId === +userId)
  if(!user){
    return res.status(404).send({message: 'Пользователь не найден'})
  }
});

router.post('/users', (req, res) => {
  const {name,about,avatar} = req.body
  if(!name || !about || !avatar){
    return res.status(400).send({ message: "Ошибка на стороне пользователя. Возможно имя, о себе или аватар введены некорректно" })
  }
fs.readFile(path.resolve(__dirname,'..','users-data.json'),'utf-8')
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
  .catch(()=>res.status(500).send({message: 'ошибка сервера'}))
})



router.get('/users', (req, res) => {
  res.status(200).send(users)

});

module.exports.userRouter = router