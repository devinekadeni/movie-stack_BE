import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import isEmail from 'validator/lib/isEmail';
import db from '../../db/Postgresql';
import TABLE from '../../db/tableName';

export const hashingPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  return hashedPassword;
};

export const generateToken = (type, data) => {
  if (type === 'refresh') {
    return jwt.sign(data, process.env.REFRESH_SECRET, { expiresIn: '7 days' });
  } else if (type === 'access') {
    return jwt.sign(data, process.env.ACCESS_SECRET, { expiresIn: '10m' });
  }
};

export const validateSignUpField = async (email, name, password) => {
  // email validation
  if (!isEmail(email)) {
    return {
      error: true,
      message: 'invalid email',
    };
  }

  const { rows: duplicateEmail } = await db.query({
    text: `SELECT * FROM ${TABLE.USER} WHERE email = $1`,
    values: [email],
  });

  if (duplicateEmail.length > 0) {
    return {
      error: true,
      message: 'email already exist',
    };
  }

  // name validation
  if (name.length < 2) {
    return {
      error: true,
      message: 'name length must be greater than five (2) characters',
    };
  }

  // password validation
  if (password.length <= 5) {
    return {
      error: true,
      message: 'password character must be greater than five (5) characters',
    };
  }

  return { error: false };
};

export const validateTokenSignIn = async (userId) => {
  // checking existing refresh token
  const { rows: existingToken } = await db.query({
    text: `SELECT id FROM ${TABLE.TOKEN} WHERE user_id = $1`,
    values: [userId],
  });

  if (existingToken.length === JSON.parse(process.env.USER_SESSION_LIMIT)) {
    // delete oldest token if new user sign in (already reach max user session limit)
    // to be replaced with the new one
    db.query({
      text: `
      DELETE FROM ${TABLE.TOKEN} 
      WHERE id IN (
        SELECT id FROM t_refresh_token
        WHERE user_id = $1
        ORDER BY updated_at ASC LIMIT 1
      ) 
    `,
      values: [userId],
    });
  }
};
