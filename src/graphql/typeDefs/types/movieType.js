const { gql } = require('apollo-server-express');

const movieType = gql`
  type Movie {
    id: ID!
    title: String!
    poster: String
    backdrop: String
    genres: [String]
    rating: Float
    summary: String
    releaseDate: String
  }

  type PopularMovies implements QueryPagination {
    totalResult: Int!
    currentPage: Int!
    totalPage: Int!
    hasMore: Boolean!
    movies: [Movie]!
  }

  input MovieFilters {
    genres: [Int]!
    ratingMin: Float
    ratingMax: Float
    releaseDateMin: String
    releaseDateMax: String
  }
`;

module.exports = movieType;
