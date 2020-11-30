const fnsAdd = require('date-fns/add');
const fnsFormat = require('date-fns/format');

function movieFormatter(movies) {
  if (!movies.length) return [];

  return movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    poster: movie.poster_path,
    backdrop: movie.backdrop_path,
    genres: movie.genre_ids,
    rating: movie.vote_average,
    summary: movie.overview,
    releaseDate: movie.release_date,
  }));
}

function isValidDate(date) {
  const [year, month, day] = date.split('-');

  if (year.length < 3) {
    return false;
  }

  if (month > 12 || month === '00') {
    return false;
  }

  if (day > 31 || day === '00') {
    return false;
  }

  return true;
}

function generateMovieParam(movieType) {
  const next4Month = fnsFormat(fnsAdd(new Date(), { months: 4 }), 'yyyy-MM-dd');
  const next2Day = fnsFormat(fnsAdd(new Date(), { days: 2 }), 'yyyy-MM-dd');
  const next3Week = fnsFormat(fnsAdd(new Date(), { weeks: 3, days: 2 }), 'yyyy-MM-dd');

  const movieParam = {
    POPULAR: {
      'release_date.lte': next4Month,
      sort_by: 'popularity.desc',
      'vote_average.gte': 0,
      'vote_average.lte': 10,
      'with_runtime.gte': 0,
      'with_runtime.lte': 400,
    },
    UPCOMING: {
      'primary_release_date.gte': next2Day,
      'primary_release_date.lte': next3Week,
      sort_by: 'popularity.desc',
      'vote_average.gte': 0,
      'vote_average.lte': 10,
      'with_runtime.gte': 0,
      'with_runtime.lte': 400,
    },
    TOP_RATED: {
      'release_date.lte': next4Month,
      sort_by: 'vote_average.desc',
      'vote_average.gte': 0,
      'vote_average.lte': 10,
      'vote_count.gte': 300,
      'with_runtime.gte': 0,
      'with_runtime.lte': 400,
    },
  };

  return movieParam[movieType];
}

module.exports = {
  movieFormatter,
  isValidDate,
  generateMovieParam,
};
