const { gql } = require('apollo-server-express')

const movieType = gql`
  type Movie {
    id: ID!
    title: String!
    poster: String!
    backdrop: String!
    genres: [String]!
    rating: Float!
    summary: String!
    releaseDate: String
  }
`

module.exports = movieType
