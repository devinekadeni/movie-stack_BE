const { gql } = require('apollo-server-express')

const queryType = gql`
  type Query {
    popularMovies: [Movie]!
    genreList: [Genre]!
  }
`

module.exports = queryType
