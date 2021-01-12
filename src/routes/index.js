import userRoute from './user';

const initializeRoutes = (app) => {
  app.use('/user', userRoute);
};

export default initializeRoutes;
