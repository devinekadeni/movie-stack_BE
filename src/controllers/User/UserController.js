const bcrypt = require('bcrypt')
const { isEmail } = require('validator').default
const TABLE = require('../../db/tableName')
const db = require('../../db/Postgresql')
const {
  hashingPassword,
  generateToken,
  validateSignUp,
  validateTokenSignIn,
} = require('./User.helper')
const {
  responseError,
  responseSuccess,
  statusCode,
  errorCode,
} = require('../../utils/response')

async function SignUp(req, res) {
  const { username, email, password } = req.body

  const validation = await validateSignUp(email, username, password)

  if (validation.error) {
    return res.status(statusCode.bad).send(
      responseError({
        errorCode: errorCode.invalidInput,
        message: validation.message,
      })
    )
  }

  try {
    const hashedPassword = await hashingPassword(password)

    // insert new user
    const { rows } = await db.query({
      text: `
        INSERT INTO ${TABLE.USER}
        (username, email, password) VALUES ($1, $2, $3)
        RETURNING *
      `,
      values: [username, email, hashedPassword],
    })

    const accessToken = generateToken('access', { user_id: rows[0].user_id.toString() })
    const refreshToken = generateToken('refresh', { user_id: rows[0].user_id.toString() })

    // insert new refresh_token
    db.query({
      text: `INSERT INTO ${TABLE.TOKEN} (user_id, token) VALUES ($1, $2)`,
      values: [rows[0].user_id, refreshToken],
    })

    delete rows[0].password

    res.status(statusCode.created).send(
      responseSuccess({
        data: { ...rows[0], access_token: accessToken, refresh_token: refreshToken },
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

async function SignIn(req, res) {
  const { usernameOrEmail, password } = req.body

  const query = isEmail(usernameOrEmail)
    ? `SELECT * FROM ${TABLE.USER} WHERE email = $1`
    : `SELECT * FROM ${TABLE.USER} WHERE username = $1`

  const { rows: userData } = await db.query({
    text: query,
    values: [usernameOrEmail],
  })

  // validation
  if (!userData.length) {
    return res.status(statusCode.notFound).send(
      responseError({
        errorCode: errorCode.notFound,
        message: 'invalid email/username or password',
      })
    )
  }

  const isPasswordMatch = await bcrypt.compare(password, userData[0].password)
  if (!isPasswordMatch) {
    return res.status(statusCode.notFound).send(
      responseError({
        errorCode: errorCode.notFound,
        message: 'invalid email/username or password',
      })
    )
  }

  validateTokenSignIn(userData[0].user_id)

  // generate new refresh_token
  const accessToken = generateToken('access', { user_id: userData[0].user_id.toString() })
  const refreshToken = generateToken('refresh', {
    user_id: userData[0].user_id.toString(),
  })

  db.query({
    text: `INSERT INTO ${TABLE.TOKEN} (user_id, token) VALUES ($1, $2)`,
    values: [userData[0].user_id, refreshToken],
  })

  delete userData[0].password

  return res.send(
    responseSuccess({
      data: { ...userData[0], access_token: accessToken, refresh_token: refreshToken },
    })
  )
}

module.exports = {
  SignUp,
  SignIn,
}
