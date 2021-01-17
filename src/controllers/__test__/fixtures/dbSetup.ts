import db from '../../../db/Postgresql'

export async function setupInitialTable() {
  await db.query({
    text: `
    CREATE TABLE t_user (
      user_id serial PRIMARY KEY,
      "name" varchar(50) NOT NULL UNIQUE,
      "password" varchar NOT NULL,
      email varchar(355) NOT NULL UNIQUE,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    )`,
  })

  await db.query({
    text: `
    CREATE TABLE t_refresh_token (
      id serial NOT NULL,
      user_id serial NOT NULL,
      refresh_token varchar NULL,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now(),
      PRIMARY KEY (id, user_id),
      FOREIGN KEY (user_id)
        REFERENCES t_user (user_id)
    )`,
  })
}

export async function clearTable() {
  await db.query({ text: `DROP TABLE t_refresh_token` })
  await db.query({ text: `DROP TABLE t_user` })
}
