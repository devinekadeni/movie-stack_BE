import Query from './queryResolver';

const resolvers = {
  Query,

  // to fix this kind of warning https://github.com/apollographql/apollo-server/issues/1075
  QueryPagination: {
    __resolveType() {
      return false;
    },
  },
};

export default resolvers;
