const { gql } = require('apollo-server-express');

const queryType = gql`
  type Query {
    movieList(page: Int!, countryId: String, movieType: MovieType!): MovieList!
    genreList: [Genre]!
  }
`;

module.exports = queryType;
