const axios = require('axios').default;

const TmdbAPI = axios.create({
  baseURL: process.env.TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
  },
});

module.exports = TmdbAPI;
