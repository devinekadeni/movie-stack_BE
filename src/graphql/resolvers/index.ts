import Query from './queryResolver'
import Mutation from './mutationResolver'

const resolvers = {
  Query,
  Mutation,

  // to fix this kind of warning https://github.com/apollographql/apollo-server/issues/1075
  QueryPagination: {
    __resolveType() {
      return false
    },
  },
}

export default resolvers
