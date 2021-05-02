import { Response } from 'express'

import { AuthenticatedRequest } from '@/commonTypes'
import TABLE from '@/db/tableName'
import db from '@/db/Postgresql'
import { responseError, responseSuccess, statusCode, errorCode } from '@/utils/response'

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
