const express = require('express')
const { SignUp, SignIn } = require('../controllers/User/UserController')

const router = express.Router()

router.post('/signup', SignUp)
router.post('/signin', SignIn)

module.exports = router
