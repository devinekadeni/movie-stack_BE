BEGIN TRANSACTION;

CREATE TABLE t_refresh_token (
  id serial NOT NULL,
  user_id serial NOT NULL,
  refresh_token varchar NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY (id, user_id),
  FOREIGN KEY (user_id)
    REFERENCES t_user (user_id)
);

COMMIT;