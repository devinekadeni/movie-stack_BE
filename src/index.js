require('dotenv').config()
const express = require('express')
const initializeRoute = require('./routes')
const { ApolloServer } = require('apollo-server-express')
const { typeDefs, resolvers } = require('./graphql')

const PORT = process.env.PORT || 3300

const app = express()

app.use(express.json())
initializeRoute(app)

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.applyMiddleware({ app, path: '/graphql' })

app.listen(PORT, () => {
  console.log('Server run on port ' + PORT)
})
