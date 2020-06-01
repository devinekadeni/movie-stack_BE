const request = require('supertest')
const app = require('../../index')
const db = require('../../db/Postgresql')
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

    expect(response.body.data.email).toBe(newUser.email)
    expect(response.body.data.name).toBe(newUser.name)
  })
})
