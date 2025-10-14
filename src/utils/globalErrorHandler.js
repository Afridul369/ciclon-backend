const developmentError = (error, res) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    message: error.message,
    data: error.data,
    statusCode: error.statusCode,
    stack: error.stack,
    status: error.status,
    isOperationalError: error.isOperationalError,
  });
};
const productionError = (error, res) => {
  const statusCode = error.statusCode || 500;
  const isOperationalError = error.isOperationalError;
  if (isOperationalError) {
    return res.status(statusCode).json({
      message: 'Email Or Password Invalid',
      statusCode: statusCode,
    });
  } else {
    return res.status(statusCode).json({
      message: "Internal Message Error",
      statusCode: statusCode,
    });
  }
};

exports.globalErrorHandler = (error, req, res, next) => {
  if (process.env.NODE_ENV == "development") {
    developmentError(error, res);
  } else {
    productionError(error, res);
  }
  // return req.status(statuscode).json({
  //     messege : error.messege,

  // })
};
