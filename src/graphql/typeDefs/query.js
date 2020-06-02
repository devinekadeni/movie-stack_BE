const { gql } = require('apollo-server-express')

const queryType = gql`
  type Query {
    popularMovies: PopularMovies!
    genreList: [Genre]!
  }
`

module.exports = queryType
