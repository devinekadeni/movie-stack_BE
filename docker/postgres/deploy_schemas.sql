-- Initialize database tables
\i '/docker-entrypoint-initdb.d/tables/t_user.sql'
\i '/docker-entrypoint-initdb.d/tables/t_refresh_token.sql'