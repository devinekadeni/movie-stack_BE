const chalk = require('chalk');
const { Pool } = require('pg');
const { devConfig, testConfig } = require('./config');

const log = process.env.NODE_ENV === 'test' ? () => {} : console.log;
const config = process.env.NODE_ENV === 'test' ? testConfig : devConfig;

const pool = new Pool(config);

module.exports = {
  query: async (query) => {
    try {
      const start = Date.now();
      const response = await pool.query(query);
      const duration = Date.now() - start;

      log(chalk.cyan('Success query ') + chalk.magenta(query.text) + ` at ${duration}ms`);
      return response;
    } catch (error) {
      log(chalk.red('Failed query ') + chalk.magenta(query.text), {
        error,
      });
      throw error;
    }
  },
  closeConnection: () => pool.end(), // for testing needs
  transaction: async (cb) => {
    const client = await pool.connect();
    const query = client.query;

    client.query = (...args) => {
      client.lastQuery = args;
      return query.apply(client, args);
    };

    try {
      await client.query('BEGIN');
      await cb(client);
      await client.query('COMMIT');
    } catch (error) {
      log(
        chalk.red('Failed query transaction, rollback '),
        chalk.magenta(client.lastQuery)
      );
      log(error);
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
  },
  getClient: async () => {
    const client = await pool.connect();

    // modifying client object to hold lastQuery properties
    const query = client.query;
    client.query = (...args) => {
      client.lastQuery = args;
      return query.apply(client, args);
    };

    const release = client.release;
    client.release = (...args) => {
      console.log('released by engineer');
      clearTimeout(timeout);
      client.query = query; // set back to its original object
      return release.apply(client, args);
    };

    // set a time limit for transaction query 5s, otherwise will auto release
    // to prevent other engineers forgot to invoke client.release on their transaction
    const timeout = setTimeout(() => {
      log(chalk.red('A client has been checked out for more than 5 seconds!'));
      log(
        chalk.red(
          `The last executed query on this client was: ${chalk.magenta(client.lastQuery)}`
        )
      );

      client.release();
    }, 5000);

    return client;
  },
};
