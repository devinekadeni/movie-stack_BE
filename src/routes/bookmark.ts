import express from 'express'
import authMiddleware from '@/middlewares/authMiddleware'
import { GetBookmarkMovie } from '@/controllers/Bookmark/BookmarkController'

const router = express.Router()

router.get('/', authMiddleware, GetBookmarkMovie)

export default router
