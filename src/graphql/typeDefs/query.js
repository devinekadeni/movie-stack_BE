const { gql } = require('apollo-server-express');

const queryType = gql`
  type Query {
    popularMovies(page: Int, sortBy: String, filters: MovieFilters): PopularMovies!
    genreList: [Genre]!
  }
`;

module.exports = queryType;
