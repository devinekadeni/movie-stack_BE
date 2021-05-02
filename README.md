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
- then make sure that we provide uuid generator extension first on our postgresql by running `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
- Now copy these commands below and run it on the psql editor to create our table

1. **User Table**

``` postgresql
CREATE TABLE t_user (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(50) NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  email VARCHAR(355) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
```

2. **User Token table**

``` postgresql
CREATE TABLE t_refresh_token (
  id SERIAL NOT NULL,
  user_id UUID NOT NULL,
  refresh_token TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  FOREIGN KEY (user_id)
    REFERENCES t_user (user_id)
);
```

3. **Bookmark Movie**

``` postgresql
CREATE TABLE t_bookmark_movie (
  id SERIAL NOT NULL,
  user_id UUID NOT NULL,
  movie_id TEXT NOT NULL,
  title TEXT,
  poster TEXT,
  backdrop TEXT,
  genres TEXT [],
  rating FLOAT(2),
  summary TEXT,
  releaseDate DATE,
  duration SMALLINT,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id)
    REFERENCES t_user (user_id)
);
```
