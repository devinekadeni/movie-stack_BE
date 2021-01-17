import { Request, Response, Application } from 'express'
import morgan from 'morgan'
import chalk from 'chalk'

const logText = (
  responseTime: number,
  operationName: string,
  variables: any,
  query: string
) => {
  return `${chalk.cyan('GraphQL:')} on ${responseTime}ms
  Operation Name: ${operationName}
  Variables: ${JSON.stringify(variables)}
  Query: ${query}`
}

interface ResponseMorgan extends Response {
  _startTime?: string
}

function initializeLogging(app: Application) {
  morgan.token('graphql-apollo', (req: Request, res: ResponseMorgan) => {
    const responseTime = Date.now() - Date.parse(res._startTime ?? '')
    const { query, variables, operationName } = req.body

    return logText(responseTime, operationName, variables, query)
  })

  // REST API log
  app.use(
    morgan('dev', {
      skip: (req) => req.baseUrl === '/graphql',
    })
  )

  // GraphQL log
  app.use(
    morgan(':graphql-apollo', {
      skip: (req) => {
        const isGraphqlRequest =
          req.baseUrl !== '/graphql' ||
          !req.body.query ||
          req.body.operationName === 'IntrospectionQuery'

        return isGraphqlRequest
      },
    })
  )
}

export default initializeLogging
