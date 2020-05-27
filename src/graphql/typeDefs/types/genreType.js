const { gql } = require('apollo-server-express')

const genreType = gql`
  type Genre {
    id: ID!
    name: String!
  }
`

module.exports = genreType
