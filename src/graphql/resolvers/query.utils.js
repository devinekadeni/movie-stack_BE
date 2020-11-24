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

module.exports = {
  movieFormatter,
  isValidDate,
};
