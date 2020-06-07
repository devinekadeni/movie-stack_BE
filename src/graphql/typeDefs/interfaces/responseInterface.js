const { gql } = require('apollo-server-express');

const responseInterface = gql`
  interface queryPagination {
    totalResult: Int!
    currentPage: Int!
    totalPage: Int!
    hasMore: Boolean!
  }
`;

module.exports = responseInterface;
