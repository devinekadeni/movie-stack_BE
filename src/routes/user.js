const express = require('express')
const bcrypt = require('bcrypt')
const TABLE = require('../db/tableName')
const db = require('../db/Postgresql')

const router = express.Router()

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  const query = {
    text: `INSERT INTO ${TABLE.USER} (username, email, password) VALUES ($1, $2, $3) RETURNING username, email, created_at, updated_at`,
    values: [username, email, hashedPassword],
  }

  try {
    const { rows } = await db.query2(query)
    res.send(rows)
  } catch (error) {
    res.status(500).send({
      error: {
        message: 'Failed creating new user',
      },
    })
  }
})

module.exports = router
