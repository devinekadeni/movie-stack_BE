const { gql } = require('apollo-server-express');

const queryType = gql`
  type Query {
    popularMovies(page: Int, currentDate: String, countryId: String): PopularMovies!
    genreList: [Genre]!
  }
`;

module.exports = queryType;
