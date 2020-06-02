function movieFormatter(movies) {
  if (!movies.length) return []

  return movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    poster: movie.poster_path,
    backdrop: movie.backdrop_path,
    genres: movie.genre_ids,
    rating: movie.vote_average,
    summary: movie.overview,
    releaseDate: movie.release_date,
  }))
}

module.exports = {
  movieFormatter,
}
