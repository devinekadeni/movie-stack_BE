import { AuthenticationError } from 'apollo-server-express'
import chalk from 'chalk'

import TmdbAPI from '@/utils/TmdbAPI'
import TABLE from '@/db/tableName'

import {
  movieFormatter,
  generateMovieParam,
  castFormatter,
  trailerFormatter,
  backdropFormatter,
} from './query.utils'
import {
  DiscoverMovieTMDB,
  GenreListTMDB,
  TrailerListTMDB,
  CastListTMDB,
  BackdropListTMDB,
  SearchParams,
  Movie,
} from './types'

const query = {
  async movieList(_: unknown, { page = 1, movieType = 'POPULAR' }) {
    try {
      const params = {
        page,
        ...generateMovieParam(movieType),
      }

      const { data }: { data: DiscoverMovieTMDB } = await TmdbAPI({
        method: 'get',
        url: '/discover/movie',
        params,
      })

      return {
        totalResult: data.total_results,
        currentPage: data.page,
        totalPage: data.total_pages,
        hasMore: data.page !== data.total_pages,
        movies: data.results.map((movie) => movieFormatter(movie)),
      }
    } catch (error) {
      console.log(chalk.red(`GraphQL query: movieList(page: ${page})`), error)
      return error
    }
  },
  async genreList() {
    try {
      const { data }: { data: GenreListTMDB } = await TmdbAPI({
        method: 'get',
        url: '/genre/movie/list',
        params: {
          language: 'en-US',
        },
      })

      return data.genres
    } catch (error) {
      console.log(chalk.red('GraphQL query: genreList'), error)
      return error
    }
  },
  async popularTrailerList(_: unknown, { countryId = 'ID' }) {
    try {
      // Get popular movies
      const params = {
        page: 1,
        certification_country: countryId.toUpperCase(),
        ...generateMovieParam('POPULAR'),
      }

      const { data }: { data: DiscoverMovieTMDB } = await TmdbAPI({
        method: 'get',
        url: '/discover/movie',
        params,
      })

      // Get popular movies' trailer
      const promiseArr = data.results.map(async (movieData) => {
        const formattedMovie = movieFormatter(movieData)
        const { data: movieTrailer }: { data: TrailerListTMDB } = await TmdbAPI({
          method: 'get',
          url: `/movie/${formattedMovie.id}/videos`,
          params,
        })

        const youtubeTrailer =
          movieTrailer?.results?.find((val) => {
            const isYoutubeTrailer = val.type === 'Trailer' && val.site === 'YouTube'
            return isYoutubeTrailer
          }) || null

        const url = youtubeTrailer
          ? `https://www.youtube.com/watch?v=${youtubeTrailer.key}`
          : ''

        return {
          ...formattedMovie,
          url,
        }
      })

      const result = await Promise.all(promiseArr)

      return result
    } catch (error) {
      console.log(chalk.red('GraphQL query: popularTrailerList'), error)
      return error
    }
  },
  async movieDetail(_: unknown, { id }: { id: number }) {
    try {
      const getMovieDetail = TmdbAPI({
        method: 'get',
        url: `/movie/${id}`,
      })

      const getCastList = TmdbAPI({
        method: 'get',
        url: `/movie/${id}/credits`,
      })

      const [resultMovie, resultCastList]: [
        { data: Movie },
        { data: CastListTMDB }
      ] = await Promise.all([getMovieDetail, getCastList])

      const formattedMovie = movieFormatter(resultMovie.data)
      const formattedCastList = resultCastList.data.cast.length
        ? resultCastList.data.cast.map((cast) => castFormatter(cast))
        : []

      return {
        movie: formattedMovie,
        castList: formattedCastList,
      }
    } catch (error) {
      console.log(chalk.red(`GraphQL query: movieDetail(id: ${id})`), error)

      return {
        movie: {},
        castList: [],
      }
    }
  },
  async movieMedia(_: unknown, { id }: { id: number }) {
    try {
      const getMovieTrailers = TmdbAPI({ method: 'get', url: `/movie/${id}/videos` })
      const getMovieBackdrops = TmdbAPI({ method: 'get', url: `/movie/${id}/images` })

      const [movieTrailers, movieBackdrops]: [
        { data: TrailerListTMDB },
        { data: BackdropListTMDB }
      ] = await Promise.all([getMovieTrailers, getMovieBackdrops])

      const formattedTrailers = movieTrailers.data.results
        .filter((trailer) => trailer.type === 'Trailer' && trailer.site === 'YouTube')
        .map(trailerFormatter)

      const formattedBackdrops = movieBackdrops.data.backdrops.map(backdropFormatter)

      return {
        movieId: id,
        trailers: formattedTrailers,
        backdrops: formattedBackdrops,
      }
    } catch (error) {
      console.log(chalk.red(`GraphQL query: movieMedia(id: ${id})`), error)

      return {
        movieId: id,
        trailers: [],
        backdrops: [],
      }
    }
  },
  async searchMovies(
    _: unknown,
    {
      page = 1,
      searchParams = { filter: {}, sortBy: 'popularity.desc' },
    }: { page: number; searchParams: SearchParams }
  ) {
    try {
      interface MappingFilter {
        [val: string]: string
      }

      const mapFilterKeyTMDB: MappingFilter = {
        releaseDateStart: 'primary_release_date.gte',
        releaseDateEnd: 'primary_release_date.lte',
        withGenres: 'with_genres',
        ratingStart: 'vote_average.gte',
        ratingEnd: 'vote_average.lte',
      }

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
        'vote_count.gte': 100,
      }

      const isUpcomingMovie =
        searchParams.filter.releaseDateStart &&
        new Date(searchParams.filter.releaseDateStart).getTime() > new Date().getTime()

      if (isUpcomingMovie) {
        params['vote_count.gte'] = 0
      }

      if (Object.keys(searchParams.filter).length) {
        const newParam = Object.entries(searchParams.filter).reduce((acc, val) => {
          const [filterKey, filterValue] = val

          if (filterValue || filterValue === 0) {
            return {
              ...acc,
              [mapFilterKeyTMDB[filterKey] as string]: filterValue,
            }
          }

          return acc
        }, {})

        params = { ...params, ...newParam }
      }

      const { data }: { data: DiscoverMovieTMDB } = await TmdbAPI({
        method: 'get',
        url: '/discover/movie',
        params,
      })

      return {
        totalResult: data.total_results,
        currentPage: data.page,
        totalPage: data.total_pages,
        hasMore: data.page !== data.total_pages,
        movies: data.results.map((movie) => movieFormatter(movie)),
      }
    } catch (error) {
      console.log(chalk.red(`GraphQL query: movieList(page: ${page})`), error)
      return error
    }
  },
  async searchMoviesByKeyword(
    _: unknown,
    { page = 1, keyword }: { page: number; keyword: string }
  ) {
    if (!keyword) {
      return {
        totalResult: 0,
        currentPage: 1,
        totalPage: 0,
        hasMore: false,
        movies: [],
      }
    }

    try {
      const params = {
        query: keyword,
      }

      const { data }: { data: DiscoverMovieTMDB } = await TmdbAPI({
        method: 'get',
        url: '/search/movie',
        params,
      })

      return {
        totalResult: data.total_results,
        currentPage: data.page,
        totalPage: data.total_pages,
        hasMore: data.page !== data.total_pages,
        movies: data.results.map((movie) => movieFormatter(movie)),
      }
    } catch (error) {
      console.log(chalk.red(`GraphQL query: searchMoviesByKeyword(page: ${page})`), error)
      return error
    }
  },
  async bookmarkMovies(_: any, __: any, ctx: any) {
    const { userId, db } = ctx

    if (!userId) {
      throw new AuthenticationError('Not Authorized')
    }

    const { rows: bookmarkData } = await db.query({
      text: `SELECT * FROM ${TABLE.BOOKMARK} WHERE user_id = $1`,
      values: [userId],
    })

    if (!bookmarkData.length) return []

    const result = bookmarkData.map((val: any) => ({
      id: val.id,
      userId: val.user_id,
      movieId: val.movie_id,
      title: val.title || '',
      poster: val.poster || '',
      backdrop: val.backdrop || '',
      genres: val.genres || [],
      rating: val.rating || 0,
      summary: val.summary,
      releaseDate: val.releasedate,
      duration: val.duration,
    }))

    return result
  },
}

export default query
