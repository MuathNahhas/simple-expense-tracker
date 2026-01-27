import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';
const LokiTransport = require('winston-loki');

@Injectable()
export class LogService implements LoggerService {
  private logger: Logger;
  constructor() {
    const transportOptions = {
      console: new transports.Console({
        format: format.combine(
          format.colorize(),
          format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          format.printf(({ timestamp, level, message, context }) => {
            return `${timestamp} [${level}] ${context ? `[${context}] ` : ''}${message}`;
          }),
        ),
      }),
      loki: new LokiTransport({
        host: process.env.DEV_GR_HOST,
        basicAuth: process.env.DEV_GR_API_KEY,
        labels: {
          app: 'qashio-api',
          server: 'nest_server',
        },
        json: true,
        format: format.json(),
        replaceTimestamp: true,
        onConnectionError: (err) => console.error('Loki Error:', err),
      }),
    };
    this.logger = createLogger({
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
      ),
      transports: [transportOptions.console, transportOptions.loki],
      exceptionHandlers: [transportOptions.console, transportOptions.loki],
      exitOnError: false,
    });
  }
  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
