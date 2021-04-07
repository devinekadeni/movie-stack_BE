import express from 'express'
import authMiddleware from '@/middlewares/authMiddleware'
import {
  SignUp,
  SignIn,
  SignOut,
  RefreshToken,
  GetUserDetail,
} from '@/controllers/User/UserController'

const router = express.Router()

router.get('/', authMiddleware, GetUserDetail)
router.post('/signup', SignUp)
router.post('/signin', SignIn)
router.post('/signout', SignOut)
router.post('/refresh_token', RefreshToken)

export default router
