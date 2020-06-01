const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../../index')
const db = require('../../db/Postgresql')
const { statusCode } = require('../../utils/response')
const TABLE = require('../../db/tableName')
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
}

describe('SIGN UP - /signup', () => {
  test('should able to register new user', async () => {
    const response = await request(app).post('/user/signup').send(user1).expect(201)

    expect(response.body.status).toBe('success')

    const { rows } = await db.query({
      text: `SELECT * FROM ${TABLE.USER} WHERE user_id = $1`,
      values: [response.body.data.user_id],
    })

    expect(rows.length).toBeGreaterThan(0)
    expect(rows[0].name).toBe(user1.name)
    expect(rows[0].email).toBe(user1.email)
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
