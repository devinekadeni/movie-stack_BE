import chalk from 'chalk'
import { Pool, QueryConfig } from 'pg'
import { devConfig, testConfig } from './config'

const log = process.env.NODE_ENV === 'test' ? () => {} : console.log
const config = process.env.NODE_ENV === 'test' ? testConfig : devConfig

const pool = new Pool(config)

const postgresqlInstance = {
  query: async (query: QueryConfig) => {
    try {
      const start = Date.now()
      const response = await pool.query(query)
      const duration = Date.now() - start

      log(chalk.cyan('Success query ') + chalk.magenta(query.text) + ` at ${duration}ms`)
      return response
    } catch (error) {
      log(chalk.red('Failed query ') + chalk.magenta(query.text), {
        error,
      })
      throw error
    }
  },
  closeConnection: () => pool.end(), // for testing needs
}

export default postgresqlInstance
