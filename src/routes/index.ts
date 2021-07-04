import { Application } from 'express'
import userRoute from './user'

const initializeRoutes = (app: Application) => {
  app.use('/user', userRoute)
}

export default initializeRoutes
