const chalk = require('chalk');
const fnsAdd = require('date-fns/add');
const fnsFormat = require('date-fns/format');

const TmdbAPI = require('../../utils/TmdbAPI');
const { movieFormatter, isValidDate } = require('./query.utils');

const query = {
  async popularMovies(_, { page = 1, currentDate = '', countryId = 'ID' }) {
    const today = isValidDate(currentDate) ? new Date(currentDate) : new Date();
    const next4Month = fnsFormat(fnsAdd(today, { months: 4 }), 'yyyy-MM-dd');

    try {
      const params = {
        page,
        certification_country: countryId.toUpperCase(),
        'release_date.lte': next4Month,
        sort_by: 'popularity.desc',
        'vote_average.gte': 0,
        'vote_average.lte': 10,
        'with_runtime.gte': 0,
        'with_runtime.lte': 400,
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
