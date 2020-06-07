const types = require('./types');
const interfaces = require('./interfaces');
const queryType = require('./query');

const typeDefs = [...types, ...interfaces, queryType];

module.exports = typeDefs;
