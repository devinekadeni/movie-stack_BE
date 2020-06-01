const express = require('express')
const {
  SignUp,
  SignIn,
  SignOut,
  RefreshToken,
} = require('../controllers/User/UserController')

const router = express.Router()

router.post('/signup', SignUp)
router.post('/signin', SignIn)
router.post('/signout', SignOut)
router.post('/refresh_token', RefreshToken)

module.exports = router
