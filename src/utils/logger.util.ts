import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import stringify from "safe-stable-stringify"; 

const logFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp(),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'stack'] }),
  winston.format.printf(({ level, message, timestamp, stack, metadata }) => {
    let metaString = '';

    if (metadata && Object.keys(metadata).length > 0) {
      try {
        metaString = ` | ${stringify(metadata)}`; 
      } catch (err) {
        metaString = ' | [Could not stringify metadata]';
      }
    }

    return stack
      ? `[${timestamp}] ${level.toUpperCase()}: ${message}${metaString}\n${stack}`
      : `[${timestamp}] ${level.toUpperCase()}: ${message}${metaString}`;
  })
);

const errorFileTransport = new DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxFiles: '7d',
  zippedArchive: true,
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  transports: [
    new winston.transports.Console(),
    errorFileTransport,
  ],
});

export default logger;
