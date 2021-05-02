import express from 'express'
import authMiddleware from '@/middlewares/authMiddleware'
import {
  GetBookmarkMovie,
  AddBookmarkMovie,
} from '@/controllers/Bookmark/BookmarkController'

const router = express.Router()

router.get('/', authMiddleware, GetBookmarkMovie)
router.post('/', authMiddleware, AddBookmarkMovie)

export default router
