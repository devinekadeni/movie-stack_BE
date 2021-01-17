import { PoolConfig } from 'pg'

export const devConfig: PoolConfig = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: (process.env.PGPORT as unknown) as number,
}

export const testConfig: PoolConfig = {
  user: process.env.PGUSER_TEST,
  password: process.env.PGPASSWORD_TEST,
  host: process.env.PGHOST_TEST,
  database: process.env.PGDATABASE_TEST,
  port: (process.env.PGPORT_TEST as unknown) as number,
}
