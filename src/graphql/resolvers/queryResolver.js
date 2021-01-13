import chalk from 'chalk';

import TmdbAPI from '../../utils/TmdbAPI';
import {
  movieFormatter,
  generateMovieParam,
  castFormatter,
  trailerFormatter,
  backdropFormatter,
} from './query.utils';

const query = {
  async movieList(_, { page = 1, movieType }) {
    try {
      const params = {
        page,
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
      console.log(chalk.red(`GraphQL query: movieList(page: ${page})`), error);
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
      console.log(chalk.red('GraphQL query: genreList'), error);
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
      console.log(chalk.red('GraphQL query: popularTrailerList'), error);
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
      console.log(chalk.red(`GraphQL query: movieDetail(id: ${id})`), error);

      return {
        movie: {},
        castList: [],
      };
    }
  },
  async movieMedia(_, { id }) {
    try {
      const getMovieTrailers = TmdbAPI({ method: 'get', url: `/movie/${id}/videos` });
      const getMovieBackdrops = TmdbAPI({ method: 'get', url: `/movie/${id}/images` });

      const [movieTrailers, movieBackdrops] = await Promise.all([
        getMovieTrailers,
        getMovieBackdrops,
      ]);

      const formattedTrailers = movieTrailers.data.results
        .filter((trailer) => trailer.type === 'Trailer' && trailer.site === 'YouTube')
        .map(trailerFormatter);

      const formattedBackdrops = movieBackdrops.data.backdrops.map(backdropFormatter);

      return {
        movieId: id,
        trailers: formattedTrailers,
        backdrops: formattedBackdrops,
      };
    } catch (error) {
      console.log(chalk.red(`GraphQL query: movieMedia(id: ${id})`), error);

      return {
        movieId: id,
        trailers: [],
        backdrops: [],
      };
    }
  },
  async searchMovies(
    _,
    { page = 1, searchParams = { filter: {}, sortBy: 'popularity.desc' } }
  ) {
    try {
      const mapFilterKeyTMDB = {
        releaseDateStart: 'primary_release_date.gte',
        releaseDateEnd: 'primary_release_date.lte',
        witghGenres: 'with_genres',
        ratingStart: 'vote_average.gte',
        ratingEnd: 'vote_average.lte',
      };

      let params = {
        page,
        sort_by: searchParams.sortBy,
        'primary_release_date.gte': '',
        'primary_release_date.lte': '',
        with_genres: '',
        'vote_average.gte': 0,
        'vote_average.lte': 10,
        'with_runtime.gte': 0,
        'with_runtime,lte': 400,
      };

      if (Object.keys(searchParams.filter).length) {
        const newParam = Object.entries(searchParams.filter).reduce((acc, val) => {
          const [filterKey, filterValue] = val;

          if (filterValue || filterValue === 0) {
            return {
              ...acc,
              [mapFilterKeyTMDB[filterKey]]: filterValue,
            };
          }

          return acc;
        }, {});

        params = { ...params, ...newParam };
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
        movies: data.results.map((movie) => movieFormatter(movie)),
      };
    } catch (error) {
      console.log(chalk.red(`GraphQL query: movieList(page: ${page})`), error);
      return error;
    }
  },
};

export default query;
