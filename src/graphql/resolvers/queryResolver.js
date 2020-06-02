const axios = require('axios').default
const { movieFormatter } = require('./query.utils')

const query = {
  async popularMovies() {
    try {
      const { data } = await axios({
        method: 'get',
        baseURL: process.env.TMDB_BASE_URL,
        url: '/discover/movie',
        headers: {
          Authorization: `Bearer ${process.env.TOKEN_TMDB}`,
        },
        params: {
          sort_by: 'popularity.desc',
          page: 2,
        },
      })

      return {
        totalResult: data.total_results,
        currentPage: data.page,
        totalPage: data.total_pages,
        hasMore: data.page !== data.total_pages,
        movies: movieFormatter(data.results),
      }
    } catch (error) {
      return error
    }
  },
  genreList() {
    return [
      {
        id: '1',
        name: 'action',
      },
      {
        id: '2',
        name: 'mystery',
      },
    ]
  },
}

module.exports = query
