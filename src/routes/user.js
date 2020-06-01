const express = require('express')
const { SignUp, SignIn, SignOut } = require('../controllers/User/UserController')

const router = express.Router()

router.post('/signup', SignUp)
router.post('/signin', SignIn)
router.post('/signout', SignOut)

module.exports = router
