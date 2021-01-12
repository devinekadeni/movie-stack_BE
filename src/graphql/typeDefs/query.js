import { gql } from 'apollo-server-express';

const queryType = gql`
  type Query {
    movieList(page: Int!, movieType: MovieType!): MovieList!
    genreList: [Genre]!
    popularTrailerList: [PopularTrailerList]!
    movieDetail(id: ID!): MovieDetail
    movieMedia(id: ID!): MovieMedia
  }
`;

export default queryType;
