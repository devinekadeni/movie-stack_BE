import 'dotenv/config';
import express, { Application } from 'express';
import helmet from 'helmet';
import initializeRoute from './routes';
import initializeLogging from './utils/logging';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './graphql';

const isProd = process.env.NODE_ENV === 'production';

const app: Application = express();

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

export default app;
