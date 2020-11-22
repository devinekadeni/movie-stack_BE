const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const TABLE = require('../../db/tableName');
const db = require('../../db/Postgresql');
const {
  hashingPassword,
  generateToken,
  validateSignUpField,
  validateTokenSignIn,
} = require('./User.helper');
const {
  responseError,
  responseSuccess,
  statusCode,
  errorCode,
} = require('../../utils/response');

async function SignUp(req, res) {
  const { name, email, password } = req.body;

  const validation = await validateSignUpField(email, name, password);

  if (validation.error) {
    return res.status(statusCode.bad).send(
      responseError({
        errorCode: errorCode.invalidInput,
        message: validation.message,
      })
    );
  }

  try {
    const hashedPassword = await hashingPassword(password);

    // insert new user
    const { rows } = await db.query({
      text: `
        INSERT INTO ${TABLE.USER}
        (name, email, password) VALUES ($1, $2, $3)
        RETURNING *
      `,
      values: [name, email, hashedPassword],
    });

    const accessToken = generateToken('access', { user_id: rows[0].user_id.toString() });
    const refreshToken = generateToken('refresh', {
      user_id: rows[0].user_id.toString(),
    });

    // insert new refresh_token
    db.query({
      text: `INSERT INTO ${TABLE.TOKEN} (user_id, refresh_token) VALUES ($1, $2)`,
      values: [rows[0].user_id, refreshToken],
    });

    delete rows[0].password;

    return res.status(statusCode.created).send(
      responseSuccess({
        data: { ...rows[0], access_token: accessToken, refresh_token: refreshToken },
      })
    );
  } catch (error) {
    console.log(error);
    res.status(500).send(
      responseError({
        errorCode: errorCode.serverError,
        message: 'server error, failed creating new user',
      })
    );
  }
}

async function SignIn(req, res) {
  const { email, password } = req.body;

  const { rows: userData } = await db.query({
    text: `SELECT * FROM ${TABLE.USER} WHERE email = $1`,
    values: [email],
  });

  // validation
  if (!userData.length) {
    return res.status(statusCode.notFound).send(
      responseError({
        errorCode: errorCode.notFound,
        message: 'invalid email or password',
      })
    );
  }

  const isPasswordMatch = await bcrypt.compare(password, userData[0].password);
  if (!isPasswordMatch) {
    return res.status(statusCode.notFound).send(
      responseError({
        errorCode: errorCode.notFound,
        message: 'invalid email or password',
      })
    );
  }

  validateTokenSignIn(userData[0].user_id);

  // generate new refresh_token
  const accessToken = generateToken('access', {
    user_id: userData[0].user_id.toString(),
  });
  const refreshToken = generateToken('refresh', {
    user_id: userData[0].user_id.toString(),
  });

  await db.query({
    text: `INSERT INTO ${TABLE.TOKEN} (user_id, refresh_token) VALUES ($1, $2)`,
    values: [userData[0].user_id, refreshToken],
  });

  delete userData[0].password;

  return res.send(
    responseSuccess({
      data: { ...userData[0], access_token: accessToken, refresh_token: refreshToken },
    })
  );
}

async function SignOut(req, res) {
  const refreshToken = req.body.refresh_token;

  try {
    await db.query({
      text: `DELETE FROM ${TABLE.TOKEN} WHERE refresh_token = $1`,
      values: [refreshToken],
    });
  } catch (error) {
    return res.status(500).send(
      responseError({
        errorCode: errorCode.serverError,
        message: 'server error, failed logging out user',
      })
    );
  }

  return res.send(
    responseSuccess({
      data: 'Sign out successfully',
    })
  );
}

async function RefreshToken(req, res) {
  const { refreshToken } = req.body;

  try {
    const data = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const newAccessToken = generateToken('access', {
      user_id: data.user_id,
    });
    const newRefreshToken = generateToken('refresh', {
      user_id: data.user_id,
    });

    db.query({
      text: `UPDATE ${TABLE.TOKEN} SET refresh_token = $1 WHERE user_id = $2 AND refresh_token = $3`,
      values: [newRefreshToken, data.user_id, refreshToken],
    });

    return res.send(
      responseSuccess({
        data: {
          userId: data.user_id,
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
        },
      })
    );
  } catch (error) {
    return res.status(statusCode.unauthorized).send({
      errorCode: errorCode.notAuthorized,
      message: 'User not authorized',
    });
  }
}

module.exports = {
  SignUp,
  SignIn,
  SignOut,
  RefreshToken,
};
