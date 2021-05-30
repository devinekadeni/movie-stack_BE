import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { ApolloServer } from 'apollo-server-express'
import jwt from 'jsonwebtoken'

import initializeRoute from '@/routes'
import initializeLogging from '@/utils/logging'
import { typeDefs, resolvers } from '@/graphql'
import db from '@/db/Postgresql'

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
  context: ({ req, res }) => {
    try {
      const accessToken = req?.headers?.authorization?.replace('Bearer ', '') ?? ''
      const data = jwt.verify(accessToken, process.env.ACCESS_SECRET ?? '') as {
        userId: string
      }

      return { userId: data.userId, db }
    } catch {
      return { userId: null, db }
    }
  },
})

server.applyMiddleware({ app, path: '/graphql' })

export default app
