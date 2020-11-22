# Backend Side of Movie Stack Apps

## **Get Started**

---

### 1. Create database on postgresql

- `brew install postgresql`
- `brew services start postgresql`
- `createdb ‘movie_stack’`

> Tips: you can install some Postgresql GUI to make your development easier, I use [DBeaver](https://dbeaver.io/download/)

### 2. Create table on `movie_stack` database

- `psql 'movie_stack'` --> to enter psql editor mode
- Copy these commands below and run it on the psql editor

1. **User Table**

``` postgresql
CREATE TABLE t_user (
  user_id serial PRIMARY KEY,
  "name" varchar(50) NOT NULL UNIQUE,
  "password" varchar NOT NULL,
  email varchar(355) NOT NULL UNIQUE,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);
```

2. **User Token table**

``` postgresql
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
```
