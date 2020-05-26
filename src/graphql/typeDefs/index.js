const types = require('./types')
const queryType = require('./query')

const typeDefs = [...types, queryType]

module.exports = typeDefs
