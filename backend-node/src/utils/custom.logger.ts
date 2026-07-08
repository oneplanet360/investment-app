import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';

dotenv.config();

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const isDev = process.env.NODE_ENV === 'development';

const devFormat = format.combine(
  format.colorize({ all: true }),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(
    (info) =>
      `${info.timestamp} [${info.level}]: ${info.message}${info.stack ? `\n${info.stack}` : ''}`
  )
);

const prodFormat = format.combine(format.timestamp(), format.json());

export const customLogger = createLogger({
  level: isDev ? 'debug' : 'info',
  format: isDev ? devFormat : prodFormat,
  transports: [
    new transports.Console({
      handleExceptions: true,
    }),
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      handleExceptions: true,
      maxsize: 5242880, //5MB,
      maxFiles: 5,
    }),
    new transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, //5MB,
      maxFiles: 5,
    }),
  ],
  exitOnError: false,
});
