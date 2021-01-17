import express from 'express'
import { SignUp, SignIn, SignOut, RefreshToken } from '../controllers/User/UserController'

const router = express.Router()

router.post('/signup', SignUp)
router.post('/signin', SignIn)
router.post('/signout', SignOut)
router.post('/refresh_token', RefreshToken)

export default router
