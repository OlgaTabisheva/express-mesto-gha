const router = require('express').Router()
const  {getUser, createUser, getUsers} = require("../controllers/users")

router.get('/users/:userId',getUser);
router.post('/users',createUser );
router.get('/users',getUsers);
router.patch('/users/me',);
router.patch('/users/me/avatar',);


module.exports.userRouter = router