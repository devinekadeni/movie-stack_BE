export const responseSuccess = ({ data }) => ({
  status: 'success',
  data,
});

export const responseError = ({ errorCode, message }) => ({
  status: 'error',
  error: {
    errorCode,
    message,
  },
});

export const statusCode = {
  success: 200,
  error: 500,
  notFound: 404,
  unauthorized: 401,
  created: 201,
  bad: 400,
};

export const errorCode = {
  invalidInput: 'invalid_input',
  serverError: 'server_error',
  notFound: 'not_found',
  notAuthorized: 'not_authorized',
};
