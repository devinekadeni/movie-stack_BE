const fnsAdd = require('date-fns/add');
const fnsSub = require('date-fns/sub');
const fnsFormat = require('date-fns/format');

function movieFormatter(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster: movie.poster_path,
    backdrop: movie.backdrop_path,
    genreIds: movie.genre_ids || [],
    genres: movie.genres || [],
    rating: movie.vote_average,
    summary: movie.overview,
    releaseDate: movie.release_date,
    duration: movie.runtime || null,
  };
}

function castFormatter(cast) {
  return {
    id: cast.id,
    name: cast.name,
    photo: cast.profile_path,
    character: cast.character,
    order: cast.order,
  };
}

function trailerFormatter(trailer) {
  return {
    id: trailer.id,
    url: `https://www.youtube.com/watch?v=${trailer.key}`,
    name: trailer.name,
  };
}

function backdropFormatter(backdrop) {
  return {
    filePath: backdrop.file_path,
    voteAvg: backdrop.vote_average,
  };
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
  const today = fnsFormat(new Date(), 'yyyy-MM-dd');
  const next4Month = fnsFormat(fnsAdd(new Date(), { months: 4 }), 'yyyy-MM-dd');
  const next2Day = fnsFormat(fnsAdd(new Date(), { days: 2 }), 'yyyy-MM-dd');
  const next3Week = fnsFormat(fnsAdd(new Date(), { weeks: 3, days: 2 }), 'yyyy-MM-dd');
  const lastMonth1Week = fnsFormat(
    fnsSub(new Date(), { months: 1, weeks: 1 }),
    'yyyy-MM-dd'
  );

  const movieParam = {
    POPULAR: {
      'primary_release_date.lte': next4Month,
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
    NOW_PLAYING: {
      'primary_release_date.gte': lastMonth1Week,
      'primary_release_date.lte': today,
      sort_by: 'popularity.desc',
      'vote_average.gte': 0,
      'vote_average.lte': 10,
      'with_runtime.gte': 0,
      'with_runtime.lte': 400,
    },
    TOP_RATED: {
      'primary_release_date.lte': next4Month,
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
  castFormatter,
  trailerFormatter,
  backdropFormatter,
};
