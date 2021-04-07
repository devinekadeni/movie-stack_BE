import { Request, Response } from 'express'
import { AuthenticatedRequest } from '@/commonTypes'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import TABLE from '@/db/tableName'
import db from '@/db/Postgresql'
import {
  hashingPassword,
  generateToken,
  validateSignUpField,
  validateTokenSignIn,
} from './User.helper'
import { responseError, responseSuccess, statusCode, errorCode } from '@/utils/response'

export async function SignUp(req: Request, res: Response) {
  const { name, email, password } = req.body

  const validation = await validateSignUpField(email, name, password)

  if (validation.error) {
    return res.status(statusCode.bad).send(
      responseError({
        errorCode: errorCode.invalidInput,
        message: validation.message ?? '',
      })
    )
  }

  try {
    const hashedPassword = await hashingPassword(password)

    // insert new user
    const { rows } = await db.query({
      text: `
        INSERT INTO ${TABLE.USER}
        (name, email, password) VALUES ($1, $2, $3)
        RETURNING *
      `,
      values: [name, email, hashedPassword],
    })

    const accessToken = generateToken('access', { userId: rows[0].user_id.toString() })
    const refreshToken = generateToken('refresh', {
      userId: rows[0].user_id.toString(),
    })

    // insert new refresh_token
    db.query({
      text: `INSERT INTO ${TABLE.TOKEN} (user_id, refresh_token) VALUES ($1, $2)`,
      values: [rows[0].user_id, refreshToken],
    })

    delete rows[0].password

    res.cookie(process.env.REFRESH_TOKEN_KEY as string, refreshToken, { httpOnly: true })

    return res.status(statusCode.created).send(
      responseSuccess({
        data: { ...rows[0], access_token: accessToken },
      })
    )
  } catch (error) {
    console.log(error)
    res.status(500).send(
      responseError({
        errorCode: errorCode.serverError,
        message: 'server error, failed creating new user',
      })
    )
  }
}

export async function SignIn(req: Request, res: Response) {
  const { email, password } = req.body

  const { rows: userData } = await db.query({
    text: `SELECT * FROM ${TABLE.USER} WHERE email = $1`,
    values: [email],
  })

  // validation
  if (!userData.length) {
    return res.status(statusCode.notFound).send(
      responseError({
        errorCode: errorCode.notFound,
        message: 'invalid email or password',
      })
    )
  }

  const isPasswordMatch = await bcrypt.compare(password, userData[0].password)
  if (!isPasswordMatch) {
    return res.status(statusCode.notFound).send(
      responseError({
        errorCode: errorCode.notFound,
        message: 'invalid email or password',
      })
    )
  }

  validateTokenSignIn(userData[0].user_id)

  // generate new refresh_token
  const accessToken = generateToken('access', {
    userId: userData[0].user_id.toString(),
  })
  const refreshToken = generateToken('refresh', {
    userId: userData[0].user_id.toString(),
  })

  await db.query({
    text: `INSERT INTO ${TABLE.TOKEN} (user_id, refresh_token) VALUES ($1, $2)`,
    values: [userData[0].user_id, refreshToken],
  })

  delete userData[0].password

  res.cookie(process.env.REFRESH_TOKEN_KEY as string, refreshToken, { httpOnly: true })

  return res.send(
    responseSuccess({
      data: { ...userData[0], access_token: accessToken },
    })
  )
}

export async function SignOut(req: Request, res: Response) {
  const refreshToken = req.body.refresh_token

  try {
    await db.query({
      text: `DELETE FROM ${TABLE.TOKEN} WHERE refresh_token = $1`,
      values: [refreshToken],
    })
  } catch (error) {
    return res.status(500).send(
      responseError({
        errorCode: errorCode.serverError,
        message: 'server error, failed logging out user',
      })
    )
  }

  return res.send(
    responseSuccess({
      data: 'Sign out successfully',
    })
  )
}

export async function RefreshToken(req: Request, res: Response) {
  const refreshToken = req.cookies[process.env.REFRESH_TOKEN_KEY as string]

  try {
    const data = jwt.verify(refreshToken, process.env.REFRESH_SECRET ?? '') as {
      userId: string
    }
    const newAccessToken = generateToken('access', {
      userId: data.userId,
    })
    const newRefreshToken = generateToken('refresh', {
      userId: data.userId,
    })

    const { rows: existingToken } = await db.query({
      text: `SELECT * FROM ${TABLE.TOKEN} WHERE user_id = $1 AND refresh_token = $2`,
      values: [data.userId, refreshToken],
    })

    if (!existingToken.length) {
      throw Error('Not Authorized')
    }

    db.query({
      text: `UPDATE ${TABLE.TOKEN} SET refresh_token = $1 WHERE user_id = $2 AND refresh_token = $3`,
      values: [newRefreshToken, data.userId, refreshToken],
    })

    res.cookie(process.env.REFRESH_TOKEN_KEY as string, refreshToken, { httpOnly: true })

    return res.send(
      responseSuccess({
        data: {
          userId: data.userId,
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
        },
      })
    )
  } catch (error) {
    return res.status(statusCode.unauthorized).send({
      errorCode: errorCode.notAuthorized,
      message: 'User not authorized',
    })
  }
}

export async function GetUserDetail(req: AuthenticatedRequest, res: Response) {
  const { userId } = req

  const { rows: userData } = await db.query({
    text: `SELECT * FROM ${TABLE.USER} WHERE user_id = $1`,
    values: [userId],
  })
  if (!userData.length) {
    return res.status(statusCode.notFound).send(
      responseError({
        errorCode: errorCode.notFound,
        message: 'oops, something wrong',
      })
    )
  }

  delete userData[0].password

  return res.send(
    responseSuccess({
      data: userData[0],
    })
  )
}
