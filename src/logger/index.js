const winston = require('winston');
const chalk = require('chalk');
require('winston-daily-rotate-file');
// Delimiter
const D = '\t|\t';

const {
  format: { combine, timestamp, colorize, printf, json },
} = winston;

// Formats
const myFormat = printf(({ level, timestamp, requestId, options, message }) => {
  const commonPart = `${level}${D}${timestamp}${D}${chalk.yellow(requestId)}`;

  if (level.match(/error/)) {
    const { error, meta, type } = options.error;

    return `${commonPart}${D}${chalk.red(type)}${D}${
      error.message
    }${D}${JSON.stringify(meta)}
    ${error.stack}`;
  }

  return `${commonPart}${D}${message}${D}${JSON.stringify(options)}`;
});
const consoleFormat = combine(colorize(), timestamp(), myFormat);
const fileFormat = combine(timestamp(), json());

// Transports
const createFileTransport = logsDirectory =>
  new winston.transports.DailyRotateFile({
    filename: `${logsDirectory}/%DATE%.log`,
    format: fileFormat,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  });

const consoleTransport = new winston.transports.Console({
  format: consoleFormat,
});

// Initialization
const createLogger = options =>
  winston.createLogger({
    level: 'info',

    transports: [
      consoleTransport,
      ...(process.env.NODE_ENV === 'production'
        ? [createFileTransport(options.logsDirectory)]
        : []),
    ],
  });

module.exports = createLogger;