const { gql } = require('apollo-server-express')

const queryType = gql`
  type Query {
    popularMovies: [Movie]!
  }
`

module.exports = queryType
