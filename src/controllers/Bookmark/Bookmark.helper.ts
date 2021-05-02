import * as yup from 'yup'

export const AddBookmarkSchema = yup.object().shape({
  movieId: yup.string().required('movieId is required'),
  title: yup.string(),
  poster: yup.string(),
  backdrop: yup.string(),
  genres: yup.array(yup.string()),
  rating: yup.number(),
  summary: yup.string(),
  releaseDate: yup.string(),
  duration: yup.number(),
})
