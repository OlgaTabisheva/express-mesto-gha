const router = require('express').Router()
const  {getUser, createUser, getUsers} = require("../controllers/users")

router.get('/users/:userId',getUser);
router.post('/users',createUser );
router.get('/users',getUsers);

module.exports.userRouter = router