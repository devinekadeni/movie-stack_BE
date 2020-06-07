const { gql } = require('apollo-server-express');

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

  type PopularMovies implements queryPagination {
    totalResult: Int!
    currentPage: Int!
    totalPage: Int!
    hasMore: Boolean!
    movies: [Movie]!
  }
`;

module.exports = movieType;
