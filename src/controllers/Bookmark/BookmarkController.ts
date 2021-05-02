import { Response } from 'express'

import { AuthenticatedRequest } from '@/commonTypes'
import TABLE from '@/db/tableName'
import db from '@/db/Postgresql'
import { responseError, responseSuccess, statusCode, errorCode } from '@/utils/response'
import { pickObject } from '@/utils/object'

import { AddBookmarkSchema } from './Bookmark.helper'

export async function GetBookmarkMovie(req: AuthenticatedRequest, res: Response) {
  const { userId } = req

  const { rows: bookmarkData } = await db.query({
    text: `SELECT * FROM ${TABLE.BOOKMARK} WHERE user_id = $1`,
    values: [userId],
  })

  if (!bookmarkData.length) {
    return res.status(statusCode.notFound).send(
      responseError({
        errorCode: errorCode.notFound,
        message: 'No Bookmark Data',
      })
    )
  }

  return res.send(
    responseSuccess({
      data: bookmarkData[0],
    })
  )
}

export async function AddBookmarkMovie(req: AuthenticatedRequest, res: Response) {
  const { userId } = req

  const payload = pickObject(req.body, [
    'movieId',
    'title',
    'poster',
    'backdrop',
    'genres',
    'rating',
    'summary',
    'releaseDate',
    'duration',
  ])

  try {
    await AddBookmarkSchema.validate(payload)
    const { rows } = await db.query({
      text: `
        INSERT INTO ${TABLE.BOOKMARK}
        (user_id, movie_id, title, poster, backdrop, genres, rating, summary, releaseDate, duration)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `,
      values: [userId, ...Object.values(payload)],
    })

    return res.status(statusCode.created).send(responseSuccess({ data: rows[0] }))
  } catch (error) {
    console.log(error)
    const errorMessage =
      error.name === 'ValidationError'
        ? error.errors[0]
        : 'server error, failed bookmark movie'

    res.status(500).send(
      responseError({
        errorCode: errorCode.serverError,
        message: errorMessage,
      })
    )
  }
}
