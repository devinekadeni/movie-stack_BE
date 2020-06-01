const request = require('supertest')
const app = require('../../index')
const db = require('../../db/Postgresql')
const TABLE = require('../../db/tableName')
const { setupInitialTable, clearTable } = require('./fixtures/dbSetup')

beforeAll(async () => {
  await setupInitialTable()
})

afterAll(async () => {
  await clearTable()
  db.closeConnection()
})

describe('SIGN UP - /signup', () => {
  test('should able to register new user', async () => {
    const newUser = {
      name: 'devin',
      email: 'devin@gmail.com',
      password: 'devin123',
    }
    const response = await request(app).post('/user/signup').send(newUser).expect(201)

    const { rows } = await db.query({
      text: `SELECT * FROM ${TABLE.USER} WHERE user_id = $1`,
      values: [response.body.data.user_id],
    })

    expect(rows.length).toBeGreaterThan(0)
    expect(rows[0].name).toBe(newUser.name)
    expect(rows[0].email).toBe(newUser.email)
  })
})
