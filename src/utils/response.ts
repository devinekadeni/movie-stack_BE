export const responseSuccess = ({ data }: { data: any }) => ({
  status: 'success',
  data,
})

export const responseError = ({
  errorCode,
  message,
}: {
  errorCode: string
  message: string
}) => ({
  status: 'error',
  error: {
    errorCode,
    message,
  },
})

export const statusCode = {
  success: 200,
  error: 500,
  notFound: 404,
  unauthorized: 401,
  created: 201,
  bad: 400,
}

export const errorCode = {
  invalidInput: 'invalid_input',
  serverError: 'server_error',
  notFound: 'not_found',
  notAuthorized: 'not_authorized',
}
