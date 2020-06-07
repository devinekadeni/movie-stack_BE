const chalk = require('chalk');
const TmdbAPI = require('../../utils/TmdbAPI');
const { movieFormatter } = require('./query.utils');

const query = {
  async popularMovies(_, { page = 1, sortBy = 'popularity.desc', filters = {} }) {
    try {
      const params = {
        sort_by: sortBy,
        page,
      };

      // populate filters if any
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

      const { data } = await TmdbAPI({
        method: 'get',
        url: '/discover/movie',
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
      console.log(chalk.red('Error Query: popularMovies', error));
      return error;
    }
  },
  async genreList() {
    try {
      const { data } = await TmdbAPI({
        method: 'get',
        url: '/genre/movie/list',
        params: {
          language: 'en-US',
        },
      });

      return data.genres;
    } catch (error) {
      console.log(chalk.red('Error Query: genreList', error));
      return error;
    }
  },
};

module.exports = query;
