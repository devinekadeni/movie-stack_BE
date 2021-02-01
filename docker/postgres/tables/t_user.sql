BEGIN TRANSACTION;

CREATE TABLE t_user (
  user_id serial PRIMARY KEY,
  "name" varchar(50) NOT NULL UNIQUE,
  "password" varchar NOT NULL,
  email varchar(355) NOT NULL UNIQUE,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

COMMIT;