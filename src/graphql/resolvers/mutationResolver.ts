import { ApolloError, AuthenticationError } from 'apollo-server-express'

import TABLE from '@/db/tableName'

type MovieData = {
  id: string
  title: string
  poster?: string
  backdrop?: string
  genres?: string[]
  rating?: number
  summary?: string
  releaseDate?: string
  duration?: number
}

const mutation = {
  async addBookmarkMovie(_: any, param: { movieData: MovieData }, ctx: any) {
    const { userId, db } = ctx

    if (!userId) {
      throw new AuthenticationError('Not Authorized')
    }

    const payload = {
      id: param.movieData.id,
      title: param.movieData.title || '',
      poster: param.movieData.poster || '',
      backdrop: param.movieData.backdrop || '',
      genres: param.movieData.genres || [],
      rating: param.movieData.rating || 0,
      summary: param.movieData.summary || '',
      releaseDate: param.movieData.releaseDate || '',
      duration: param.movieData.duration || 0,
    }

    try {
      const { rows } = await db.query({
        text: `
          INSERT INTO ${TABLE.BOOKMARK}
          (user_id, movie_id, title, poster, backdrop, genres, rating, summary, releaseDate, duration)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING *
        `,
        values: [userId, ...Object.values(payload)],
      })

      return  {
        id: rows[0].movie_id,
        title: rows[0].title,
        poster: rows[0].poster,
        backdrop: rows[0].backdrop,
        genres: rows[0].genres,
        rating: rows[0].rating,
        summary: rows[0].summary,
        releaseDate: rows[0].releaseDate,
        duration: rows[0].duration
      }
    } catch (error) {
      throw new ApolloError('Server error, failed adding bookmark movie')
    }
  },
}

export default mutation
