import { gql } from 'apollo-server-express'

const movieType = gql`
  enum MovieType {
    POPULAR
    UPCOMING
    NOW_PLAYING
    TOP_RATED
  }

  type Movie {
    id: ID
    title: String
    poster: String
    backdrop: String
    genres: [Genre]!
    genreIds: [String]!
    rating: Float
    summary: String
    releaseDate: String
    duration: Int
  }

  type BookmarkMovie {
    id: ID
    title: String
    poster: String
    backdrop: String
    genres: [String]!
    rating: Float
    summary: String
    releaseDate: String
    duration: Int
  }

  type MovieList implements QueryPagination {
    totalResult: Int!
    currentPage: Int!
    totalPage: Int!
    hasMore: Boolean!
    movies: [Movie]!
  }

  type PopularTrailerList {
    id: ID!
    title: String!
    poster: String
    backdrop: String
    genres: [String]
    rating: Float
    summary: String
    releaseDate: String
    url: String
  }

  type MovieDetail {
    movie: Movie
    castList: [Cast]!
  }

  type Trailer {
    id: ID!
    url: String!
    name: String!
  }

  type Backdrop {
    filePath: String!
    voteAvg: Float
  }

  type MovieMedia {
    movieId: ID!
    trailers: [Trailer]!
    backdrops: [Backdrop]
  }

  type BookmarkMovies {
    id: ID!
    userId: String!
    movieId: String!
    title: String!
    poster: String
    backdrop: String
    genres: [String]!
    rating: Float
    summary: String
    releaseDate: String
    duration: Int
  }
`

export default movieType
