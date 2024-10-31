import { Injectable } from '@nestjs/common';
import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {
  private logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp(),
      format.json(),
    ),
    transports: [
      new transports.Console(),
      new transports.DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'info',
      }),
      new transports.File({ filename: 'logs/error.log', level: 'error' }),
      new transports.File({ filename: 'logs/warn.log', level: 'warn' }),
      new transports.File({ filename: 'logs/debug.log', level: 'debug' }),
    ],
  });

  info(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, { trace });
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
