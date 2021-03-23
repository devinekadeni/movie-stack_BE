import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import initializeRoute from './routes'
import initializeLogging from './utils/logging'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs, resolvers } from './graphql'

const isProd = process.env.NODE_ENV === 'production'

const app = express()

if (!isProd) {
  app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
}

app.use(cookieParser())
app.use(express.json())

if (isProd) {
  app.use(helmet())
}

initializeLogging(app)
initializeRoute(app)

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.applyMiddleware({ app, path: '/graphql' })

export default app
