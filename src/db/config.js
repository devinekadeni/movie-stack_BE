const devConfig = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
}

const testConfig = {
  user: process.env.PGUSER_TEST,
  password: process.env.PGPASSWORD_TEST,
  host: process.env.PGHOST_TEST,
  database: process.env.PGDATABASE_TEST,
  port: process.env.PGPORT_TEST,
}

module.exports = {
  devConfig,
  testConfig,
}
