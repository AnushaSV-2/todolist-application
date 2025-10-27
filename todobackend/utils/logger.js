const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Define log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: 'info', // info, warn, error
  format: combine(
    colorize(),                 // for colored console output
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console(),   // ✅ prints to terminal
    new transports.File({ filename: 'logs/app.log' }) // ✅ saves to file
  ]
});

module.exports = logger;
