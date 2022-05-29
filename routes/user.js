const router = require('express').Router();
const {
  getUser, patchUser, patchAvatar, getUsers, getUserMe,
} = require('../controllers/users');

router.get('/users/me', getUserMe);
router.get('/users/:userId', getUser);
router.patch('/users/me', patchUser);
router.get('/users', getUsers);
router.patch('/users/me/avatar', patchAvatar);

module.exports.userRouter = router;
