const db = require('../../../db/Postgresql');

async function setupInitialTable() {
  await db.query({
    text: `
    CREATE TABLE t_user (
      user_id serial NOT NULL,
      "name" varchar(50) NOT NULL,
      "password" varchar NOT NULL,
      email varchar(355) NOT NULL,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now(),
      CONSTRAINT t_user_email_key UNIQUE (email),
      CONSTRAINT t_user_pkey PRIMARY KEY (user_id),
      CONSTRAINT t_user_username_key UNIQUE (name)
    )`,
  });

  await db.query({
    text: `
    CREATE TABLE t_refresh_token (
      id serial NOT NULL,
      user_id serial NOT NULL,
      refresh_token varchar NULL,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now(),
      CONSTRAINT t_refresh_token_pkey PRIMARY KEY (id, user_id),
      CONSTRAINT t_refresh_token_user_id_fkey FOREIGN KEY (user_id) REFERENCES t_user(user_id)
    )`,
  });
}

async function clearTable() {
  await db.query({ text: `DROP TABLE t_refresh_token` });
  await db.query({ text: `DROP TABLE t_user` });
}

module.exports = { setupInitialTable, clearTable };
