const jwt = require('jsonwebtoken');
const { statusCode, errorCode } = require('../utils/response');

const authMiddleware = async (req, res, next) => {
  try {
    const access_token = req.headers.authorization.replace('Bearer ', '');
    const data = jwt.verify(access_token, process.env.ACCESS_SECRET);

    req.userId = data.user_id;
    return next();
  } catch (error) {
    return res.status(statusCode.unauthorized).send({
      errorCode: errorCode.notAuthorized,
      message: 'User not authorized',
    });
  }
};

module.exports = authMiddleware;
