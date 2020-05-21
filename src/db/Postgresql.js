const chalk = require('chalk')
const { Pool } = require('pg')
const log = console.log

const pool = new Pool()

module.exports = {
  query: async (query) => {
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
}
