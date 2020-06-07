const { gql } = require('apollo-server-express');

const responseInterface = gql`
  interface QueryPagination {
    totalResult: Int!
    currentPage: Int!
    totalPage: Int!
    hasMore: Boolean!
  }
`;

module.exports = responseInterface;
