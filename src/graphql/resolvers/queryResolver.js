const chalk = require('chalk');

const TmdbAPI = require('../../utils/TmdbAPI');
const { movieFormatter, generateMovieParam, castFormatter } = require('./query.utils');

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
        movies: data.results.map((movie) => movieFormatter(movie)),
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
  async popularTrailerList(_, { countryId = 'ID' }) {
    try {
      // Get popular movies
      const params = {
        page: 1,
        certification_country: countryId.toUpperCase(),
        ...generateMovieParam('POPULAR'),
      };

      const { data } = await TmdbAPI({
        method: 'get',
        url: '/discover/movie',
        params,
      });

      // Get popular movies' trailer
      const promiseArr = data.results.map(async (movieData) => {
        const formattedMovie = movieFormatter(movieData);
        const { data: movieTrailer } = await TmdbAPI({
          method: 'get',
          url: `/movie/${formattedMovie.id}/videos`,
          params,
        });

        const youtubeTrailer =
          movieTrailer.results.length > 0
            ? movieTrailer.results.find(
                (val) => val.type === 'Trailer' && val.site === 'YouTube'
              )
            : null;

        const url = youtubeTrailer
          ? `https://www.youtube.com/watch?v=${youtubeTrailer.key}`
          : '';

        return {
          ...formattedMovie,
          url,
        };
      });

      const result = await Promise.all(promiseArr);

      return result;
    } catch (error) {
      console.log(chalk.red(`Error Query: Random trailer list`, error));
      return error;
    }
  },
  async movieDetail(_, { id }) {
    try {
      const getMovieDetail = TmdbAPI({
        method: 'get',
        url: `/movie/${id}`,
      });

      const getCastList = TmdbAPI({
        method: 'get',
        url: `/movie/${id}/credits`,
      });

      const [resultMovie, resultCastList] = await Promise.all([
        getMovieDetail,
        getCastList,
      ]);

      const formattedMovie = movieFormatter(resultMovie.data);
      const formattedCastList = resultCastList.data.cast.length
        ? resultCastList.data.cast.map((cast) => castFormatter(cast))
        : [];

      return {
        movie: formattedMovie,
        castList: formattedCastList,
      };
    } catch (error) {
      return {
        movie: {},
        castList: [],
      };
    }
  },
};

module.exports = query;
