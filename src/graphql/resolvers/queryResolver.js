const chalk = require('chalk');

const TmdbAPI = require('../../utils/TmdbAPI');
const { movieFormatter, generateMovieParam } = require('./query.utils');

const query = {
  async movieList(_, { page = 1, countryId = 'ID', movieType }) {
    try {
      const params = {
        page,
        certification_country: countryId.toUpperCase(),
        ...generateMovieParam(movieType),
      };

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
      console.log(chalk.red(`Error Query: ${movieType} Movies`, error));
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
