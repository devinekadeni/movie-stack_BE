import types from './types'
import interfaces from './interfaces'
import queryType from './query'
import mutationType from './mutation'

const typeDefs = [...types, ...interfaces, queryType, mutationType]

export default typeDefs
