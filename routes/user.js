const router = require('express').Router();
const {
  getUser, patchUser, patchAvatar,
} = require('../controllers/users');

router.get('/users/:userId', getUser);
router.patch('/users/me', patchUser);
router.patch('/users/me/avatar', patchAvatar);

module.exports.userRouter = router;
