import { gql } from 'apollo-server-express'

const mutationType = gql`
  input MovieDataInput {
    id: ID!
    title: String!
    poster: String
    backdrop: String
    genres: [String]!
    rating: Float
    summary: String
    releaseDate: String
    duration: Int
  }

  type Mutation {
    addBookmarkMovie(movieData: MovieDataInput!): BookmarkMovie
  }
`

export default mutationType
