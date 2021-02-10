import fnsAdd from 'date-fns/add'
import fnsSub from 'date-fns/sub'
import fnsFormat from 'date-fns/format'
import { Movie, Cast, Trailer, Backdrop } from './types'

export function movieFormatter(movie: Movie) {
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
  }
}

export function castFormatter(cast: Cast) {
  return {
    id: cast.id,
    name: cast.name,
    photo: cast.profile_path,
    character: cast.character,
    order: cast.order,
  }
}

export function trailerFormatter(trailer: Trailer) {
  return {
    id: trailer.id,
    url: `https://www.youtube.com/watch?v=${trailer.key}`,
    name: trailer.name,
  }
}

export function backdropFormatter(backdrop: Backdrop) {
  return {
    filePath: backdrop.file_path,
    voteAvg: backdrop.vote_average,
  }
}

export function isValidDate(date: string) {
  const [year, month, day] = date.split('-')

  if (year.length < 3) {
    return false
  }

  if (Number(month) > 12 || month === '00') {
    return false
  }

  if (Number(day) > 31 || day === '00') {
    return false
  }

  return true
}

export function generateMovieParam(movieType: string) {
  const today = fnsFormat(new Date(), 'yyyy-MM-dd')
  const next4Month = fnsFormat(fnsAdd(new Date(), { months: 4 }), 'yyyy-MM-dd')
  const next2Day = fnsFormat(fnsAdd(new Date(), { days: 2 }), 'yyyy-MM-dd')
  const next3Week = fnsFormat(fnsAdd(new Date(), { weeks: 3, days: 2 }), 'yyyy-MM-dd')
  const lastMonth1Week = fnsFormat(
    fnsSub(new Date(), { months: 1, weeks: 1 }),
    'yyyy-MM-dd'
  )

  interface MovieParam {
    [val: string]: {
      'primary_release_date.lte'?: string
      'primary_release_date.gte'?: string
      // eslint-disable-next-line camelcase
      sort_by: string
      'vote_average.gte'?: number
      'vote_average.lte'?: number
      'with_runtime.gte'?: number
      'with_runtime.lte'?: number
      'vote_count.gte'?: number
    }
  }

  const movieParam: MovieParam = {
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
      'vote_count.gte': 100,
      'with_runtime.gte': 0,
      'with_runtime.lte': 400,
    },
  }

  return movieParam[movieType]
}
