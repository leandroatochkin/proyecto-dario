const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // Set the minimum log level to capture (e.g., 'info', 'warn', 'error')
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.simple(),
    }),

    // File transport
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Logs 'error' level and above
    new winston.transports.File({ filename: 'logs/combined.log' }) // Logs all levels
  ]
});


module.exports = {logger}