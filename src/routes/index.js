const userRoute = require('./user');

const initializeRoutes = (app) => {
  app.use('/user', userRoute);
};

module.exports = initializeRoutes;
