import { Application } from 'express'
import userRoute from './user'
import bookmarkRoute from './bookmark'

const initializeRoutes = (app: Application) => {
  app.use('/user', userRoute)
  app.use('/bookmark', bookmarkRoute)
}

export default initializeRoutes
