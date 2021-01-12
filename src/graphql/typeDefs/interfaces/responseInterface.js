import { gql } from 'apollo-server-express';

const responseInterface = gql`
  interface QueryPagination {
    totalResult: Int!
    currentPage: Int!
    totalPage: Int!
    hasMore: Boolean!
  }
`;

export default responseInterface;
