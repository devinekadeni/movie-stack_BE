require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const initializeRoute = require('./routes');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./graphql');

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
initializeRoute(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });

module.exports = app;
