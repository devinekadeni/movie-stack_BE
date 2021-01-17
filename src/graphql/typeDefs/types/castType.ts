import { gql } from 'apollo-server-express'

const castType = gql`
  type Cast {
    id: ID!
    name: String!
    photo: String
    character: String
    order: Int
  }
`

export default castType
