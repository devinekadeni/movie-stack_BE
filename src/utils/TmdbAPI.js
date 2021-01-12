import axios from 'axios';

const TmdbAPI = axios.create({
  baseURL: process.env.TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
  },
});

export default TmdbAPI;
