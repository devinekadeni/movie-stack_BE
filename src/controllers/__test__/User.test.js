const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../../index')
const db = require('../../db/Postgresql')
const { statusCode } = require('../../utils/response')
const TABLE = require('../../db/tableName')
const { hashingPassword } = require('../User/User.helper')
const { setupInitialTable, clearTable } = require('./fixtures/dbSetup')

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
  refresh_token: '',
}

beforeEach(async () => {
  const hashedPassword = await hashingPassword(user1.password)
  const { rows } = await db.query({
    text: `INSERT INTO ${TABLE.USER} (name, password, email) VALUES ($1, $2, $3) RETURNING *`,
    values: [user1.name, hashedPassword, user1.email],
  })
  const refreshToken = jwt.sign(
    { user_id: rows[0].user_id.toString },
    process.env.REFRESH_SECRET
  )
  // const refreshToken = generateToken('refresh', rows[0].user_id.toString())

  await db.query({
    text: `INSERT INTO ${TABLE.TOKEN} (user_id, refresh_token) VALUES ($1, $2)`,
    values: [rows[0].user_id, refreshToken],
  })

  user1.refresh_token = refreshToken
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

    expect(status).toBe('success')
    expect(jwt.verify(data.refresh_token, process.env.REFRESH_SECRET).user_id).toBe(
      data.user_id.toString()
    )
    expect(jwt.verify(data.access_token, process.env.ACCESS_SECRET).user_id).toBe(
      data.user_id.toString()
    )

    const { rows } = await db.query({
      text: `SELECT * FROM ${TABLE.TOKEN} WHERE refresh_token = $1`,
      values: [data.refresh_token],
    })

    expect(rows.length).toBeGreaterThan(0)
  })
})

describe('SIGN OUT - /signout', () => {
  test('should able to logout loggedin user', async () => {
    const response = await request(app)
      .post('/user/signout')
      .send({ refresh_token: user1.refresh_token })
      .expect(200)

    expect(response.body.status).toBe('success')

    const { rows } = await db.query({
      text: `SELECT * FROM ${TABLE.TOKEN} WHERE refresh_token = $1`,
      values: [user1.refresh_token],
    })
    expect(rows.length).toEqual(0)
  })
})

describe('REFRESH TOKEN - /refresh_token', () => {
  test('should generate new token if req.body.refresh_token valid', async () => {
    const response = await request(app)
      .post('/user/refresh_token')
      .send({ refreshToken: user1.refresh_token })
      .expect(200)

    expect(response.body.status).toBe('success')
    expect(response.body.data.refresh_token).not.toBe(user1.refresh_token)
  })
})
