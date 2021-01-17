import { gql } from 'apollo-server-express'

const genreType = gql`
  type Genre {
    id: ID!
    name: String!
  }
`

export default genreType
