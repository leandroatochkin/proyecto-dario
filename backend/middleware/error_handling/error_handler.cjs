// errorHandler.js
const { logger } = require('./error_logger.cjs'); // Adjust the path as necessary

function errorHandler(err, req, res, next) {
  logger.error(`${err.message} - ${req.method} ${req.url}`); // Log the error message with Winston
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR'
  });
}

module.exports = errorHandler;
