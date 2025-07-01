import winston from "winston";

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'stack'] }),
    winston.format.printf(({ level, message, timestamp, stack, metadata }) => {
      const metaString = metadata && Object.keys(metadata).length > 0
        ? ` | ${JSON.stringify(metadata)}`
        : '';
      
      return stack
        ? `[${timestamp}] ${level.toUpperCase()}: ${message}${metaString}\n${stack}`
        : `[${timestamp}] ${level.toUpperCase()}: ${message}${metaString}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
