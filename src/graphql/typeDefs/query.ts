import { gql } from 'apollo-server-express'

const queryType = gql`
  input MovieFilter {
    releaseDateStart: String
    releaseDateEnd: String
    withGenres: String
    ratingStart: Float
    ratingEnd: Float
  }

  input searchParams {
    filter: MovieFilter
    sortBy: String
  }

  type Query {
    movieList(page: Int!, movieType: MovieType!): MovieList!
    genreList: [Genre]!
    popularTrailerList: [PopularTrailerList]!
    movieDetail(id: ID!): MovieDetail
    movieMedia(id: ID!): MovieMedia
    searchMovies(page: Int!, searchParams: searchParams): MovieList!
  }
`

export default queryType
