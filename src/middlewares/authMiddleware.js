import jwt from 'jsonwebtoken';
import { statusCode, errorCode } from '../utils/response';

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

export default authMiddleware;
