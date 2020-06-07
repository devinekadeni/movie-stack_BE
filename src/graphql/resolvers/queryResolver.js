const axios = require('axios').default;
const { movieFormatter } = require('./query.utils');

const query = {
  async popularMovies(_, { page = 1, sortBy = 'popularity.desc', filters = {} }) {
    try {
      const params = {
        sort_by: sortBy,
        page,
      };

      const { genres, ratingMin, ratingMax, releaseDateMin, releaseDateMax } = filters;

      if (genres && genres.length) {
        params.with_genres = genres.join('|');
      }

      if (ratingMin) {
        params['vote_average.gte'] = ratingMin;
      }

      if (ratingMax) {
        params['vote_average.lte'] = ratingMax;
      }

      if (releaseDateMin) {
        params['primary_release_date.gte'] = releaseDateMin;
      }

      if (releaseDateMax) {
        params['primary_release_date.lte'] = releaseDateMax;
      }

      const { data } = await axios({
        method: 'get',
        baseURL: process.env.TMDB_BASE_URL,
        url: '/discover/movie',
        headers: {
          Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
        },
        params,
      });

      return {
        totalResult: data.total_results,
        currentPage: data.page,
        totalPage: data.total_pages,
        hasMore: data.page !== data.total_pages,
        movies: movieFormatter(data.results),
      };
    } catch (error) {
      return error;
    }
  },
  genreList() {
    return [
      {
        id: '1',
        name: 'action',
      },
      {
        id: '2',
        name: 'mystery',
      },
    ];
  },
};

module.exports = query;
