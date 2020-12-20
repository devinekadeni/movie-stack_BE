require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const initializeRoute = require('./routes');
const initializeLogging = require('./utils/logging');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./graphql');

const isProd = process.env.NODE_ENV === 'production';

const app = express();

app.use(express.json());

if (isProd) {
  app.use(helmet());
}

initializeLogging(app);
initializeRoute(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });

module.exports = app;
