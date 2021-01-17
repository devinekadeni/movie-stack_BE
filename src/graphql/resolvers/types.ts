/* eslint-disable camelcase */

interface Filter {
  releaseDateStart?: string
  releaseDateEnd?: string
  withGenres?: string
  ratingStart?: number
  ratingEnd?: number
}

export interface SearchParams {
  filter: Filter
  sortBy: string
}

/* ====== TMDB TYPES BELOW ====== */
interface Genre {
  id: number
  name: string
}

export interface GenreListTMDB {
  genres: Genre[]
}

export interface Movie {
  id: number
  title: string
  poster_path: string
  backdrop_path: string
  genre_ids: number[]
  genres: Genre[]
  vote_average: number
  overview: string
  release_date: string
  runtime: number
  vote_count: number
}

export interface DiscoverMovieTMDB {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface Cast {
  id: number
  name: string
  profile_path: string
  character: string
  order: number
}

export interface CastListTMDB {
  id: number
  cast: Cast[]
}

export interface Trailer {
  id: string
  iso_639_1: string
  iso_3166_1: string
  key: string
  name: string
  site: string
  size: number
  type: string
}

export interface TrailerListTMDB {
  id: number
  results: Trailer[]
}

export interface Backdrop {
  aspect_ratio: number
  file_path: string
  height: number
  iso_639_1: string
  vote_average: number
  vote_count: number
  width: number
}

export interface BackdropListTMDB {
  id: number
  backdrops: Backdrop[]
}

export interface ResponseErrorTMDB {
  status_message: string
  status_code: number
}
