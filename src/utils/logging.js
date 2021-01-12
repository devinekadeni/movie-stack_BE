import morgan from 'morgan';
import chalk from 'chalk';

const logText = (responseTime, operationName, variables, query) => {
  return `${chalk.cyan('GraphQL:')} on ${responseTime}ms
  Operation Name: ${operationName}
  Variables: ${JSON.stringify(variables)}
  Query: ${query}`;
};

function initializeLogging(app) {
  morgan.token('graphql-apollo', (req, res) => {
    const responseTime = Date.now() - Date.parse(res._startTime);
    const { query, variables, operationName } = req.body;

    return logText(responseTime, operationName, variables, query);
  });

  // REST API log
  app.use(
    morgan('dev', {
      skip: (req) => req.baseUrl === '/graphql',
    })
  );

  // GraphQL log
  app.use(
    morgan(':graphql-apollo', {
      skip: (req) => {
        if (
          req.baseUrl !== '/graphql' ||
          !req.body.query ||
          req.body.operationName === 'IntrospectionQuery'
        )
          return true;
      },
    })
  );
}

export default initializeLogging;
