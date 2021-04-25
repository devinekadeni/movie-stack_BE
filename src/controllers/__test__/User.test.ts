import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../../index'
import db from '../../db/Postgresql'
import { statusCode } from '../../utils/response'
import TABLE from '../../db/tableName'
import { hashingPassword } from '../User/User.helper'
import { setupInitialTable, clearTable } from './fixtures/dbSetup'

beforeAll(async () => {
  await setupInitialTable()
})

afterAll(async () => {
  await clearTable()
  db.closeConnection()
})

const user1 = {
  name: 'devin',
  email: 'devin@gmail.com',
  password: 'devin123',
}

function getCookie(headers: { ['set-cookie']: string[] }, cname: string): string {
  const name = cname + '='
  const decodedCookie = decodeURIComponent(headers['set-cookie'][0])
  const arrayOfCookie = decodedCookie.split(';')

  for (let i = 0; i < arrayOfCookie.length; i++) {
    let cookie = arrayOfCookie[i]
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1)
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length)
    }
  }
  return ''
}

beforeEach(async () => {
  const hashedPassword = await hashingPassword(user1.password)
  const { rows } = await db.query({
    text: `INSERT INTO ${TABLE.USER} (name, password, email) VALUES ($1, $2, $3) RETURNING *`,
    values: [user1.name, hashedPassword, user1.email],
  })
  const refreshToken = jwt.sign(
    { userId: rows[0].user_id.toString },
    process.env.REFRESH_SECRET ?? ''
  )

  await db.query({
    text: `INSERT INTO ${TABLE.TOKEN} (user_id, refresh_token) VALUES ($1, $2)`,
    values: [rows[0].user_id, refreshToken],
  })
})

afterEach(async () => {
  await db.query({
    text: `DELETE FROM ${TABLE.TOKEN}`,
  })
  await db.query({
    text: `DELETE FROM ${TABLE.USER}`,
  })
})

describe('SIGN UP - /signup', () => {
  test('should able to register new user', async () => {
    const newUser = {
      name: 'ekadeni',
      email: 'ekadeni@gmail.com',
      password: 'ekadeni123',
    }
    const response = await request(app).post('/user/signup').send(newUser).expect(201)

    const refreshToken = getCookie(
      response.headers,
      process.env.REFRESH_TOKEN_KEY as string
    )

    expect(refreshToken).toBeDefined()
    expect(response.body.status).toBe('success')

    const { rows } = await db.query({
      text: `SELECT * FROM ${TABLE.USER} WHERE user_id = $1`,
      values: [response.body.data.user_id],
    })

    expect(rows.length).toBeGreaterThan(0)
    expect(rows[0].name).toBe(newUser.name)
    expect(rows[0].email).toBe(newUser.email)
  })
})

describe('SIGN IN - /signin', () => {
  test('should not login non existing user', async () => {
    const response = await request(app)
      .post('/user/signin')
      .send({ email: 'xxx@xxx.com', password: 'xxxxxx' })
      .expect(statusCode.notFound)

    expect(response.body.status).toBe('error')
  })

  test('should able to login existing user', async () => {
    const response = await request(app)
      .post('/user/signin')
      .send({ email: user1.email, password: user1.password })
      .expect(200)

    const { status, data } = response.body

    const refreshToken = getCookie(
      response.headers,
      process.env.REFRESH_TOKEN_KEY as string
    )

    expect(refreshToken).toBeDefined()
    expect(status).toBe('success')
    expect(
      (jwt.verify(data.access_token, process.env.ACCESS_SECRET ?? '') as {
        userId: string
      }).userId
    ).toBe(data.user_id.toString())
  })
})

describe('SIGN OUT - /signout', () => {
  test('should able to logout loggedin user', async () => {
    const responseUser = await request(app)
      .post('/user/signin')
      .send({ email: user1.email, password: user1.password })

    const response = await request(app)
      .post('/user/signout')
      .set('Cookie', responseUser.headers['set-cookie'])
      .expect(200)

    expect(response.body.status).toBe('success')

    const refreshToken = getCookie(
      response.headers,
      process.env.REFRESH_TOKEN_KEY as string
    )

    const { rows } = await db.query({
      text: `SELECT * FROM ${TABLE.TOKEN} WHERE refresh_token = $1`,
      values: [refreshToken],
    })
    expect(rows.length).toEqual(0)
  })
})

describe('REFRESH TOKEN - /refresh_token', () => {
  test('should generate new token if refresh_token still valid', async () => {
    const responseUser = await request(app)
      .post('/user/signin')
      .send({ email: user1.email, password: user1.password })

    const response = await request(app)
      .post('/user/refresh_token')
      .set('Cookie', responseUser.headers['set-cookie'])
      .expect(200)

    expect(response.body.status).toBe('success')
  })

  test('should return unauthorized if refresh_token invalid', async () => {
    const response = await request(app).post('/user/refresh_token').expect(401)

    expect(response.body.errorCode).toBe('not_authorized')
  })
})
