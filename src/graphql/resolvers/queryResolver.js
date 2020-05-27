const query = {
  popularMovies() {
    return [
      {
        id: '1',
        title: 'Batman',
        poster: 'poster.jpg',
        backdrop: 'backdrop.jpg',
        genres: ['action', 'fiction'],
        rating: 8.2,
        summary: 'the dark knight ben affleck',
        releaseDate: '2018-08-12',
      },
    ]
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
