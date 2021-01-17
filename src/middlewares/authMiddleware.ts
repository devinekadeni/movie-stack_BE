import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthenticatedRequest } from '../commonTypes'
import { statusCode, errorCode } from '../utils/response'

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req?.headers?.authorization?.replace('Bearer ', '') ?? ''
    const data = jwt.verify(accessToken, process.env.ACCESS_SECRET ?? '') as {
      userId: string
    }

    req.userId = data.userId
    return next()
  } catch (error) {
    return res.status(statusCode.unauthorized).send({
      errorCode: errorCode.notAuthorized,
      message: 'User not authorized',
    })
  }
}

export default authMiddleware
