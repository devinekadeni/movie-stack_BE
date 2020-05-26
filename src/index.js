require('dotenv').config()
const express = require('express')
const initializeRoute = require('./routes')
const { ApolloServer, gql } = require('apollo-server-express')

const PORT = process.env.PORT || 3300

const app = express()

app.use(express.json())
initializeRoute(app)

const Query = gql`
  type Query {
    hello: String
    movie: Movie
  }
`

const Movie = gql`
  type Movie {
    id: ID
    title: String
    actor: String
  }
`

const typeDefs = [Query, Movie]

const resolvers = {
  Query: {
    hello() {
      return 'Hello GraphQL World'
    },
    movie() {
      return {
        id: 1,
        title: 'Harry Potter',
        actor: 'Daniel Radcliff',
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.applyMiddleware({ app, path: '/graphql' })

app.listen(PORT, () => {
  console.log('Server run on port ' + PORT)
})
