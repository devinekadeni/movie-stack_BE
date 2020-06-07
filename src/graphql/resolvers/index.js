const Query = require('./queryResolver');

const resolvers = {
  Query,
  QueryPagination: {
    __resolveType() {
      return false;
    },
  },
};

module.exports = resolvers;
