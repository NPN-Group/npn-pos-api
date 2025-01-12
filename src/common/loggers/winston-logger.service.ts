import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { LoggerService } from '@nestjs/common';

@Injectable()
export class WinstonLoggerService implements LoggerService {
    private readonly logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'MMM DD YYYY HH:mm:ss' }),
                winston.format.errors({ stack: true }),
                winston.format.printf(({ timestamp, level, message, stack }) => {
                    let msg = `${timestamp} [${level}]`;
                    const formattedMessage = typeof message === 'object' ? JSON.stringify(message) : message;
                    if (stack) {
                        const lines = (stack as string).split('\n');
                        msg += ` ${formattedMessage} ${lines.join()}`;
                    }
                    else {
                        msg += ` ${formattedMessage}`;
                    }
                    return msg;
                })
            ),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.timestamp({ format: 'MMM DD YYYY HH:mm:ss' }),
                        winston.format.printf(({ timestamp, level, message, stack }) => {
                            const formattedMessage = typeof message === 'object' ? JSON.stringify(message) : message;
                            let msg = `\n[${timestamp}] ${level}] ${formattedMessage}`;
                            if (stack) {
                                const lines = (stack as string).split('\n');
                                msg += ` ${lines.join()}\n`;
                            }
                            return msg;
                        })
                    ),
                }),

                new winston.transports.File({
                    filename: 'logs/app.log',
                    format: winston.format.combine(
                        winston.format.timestamp({ format: 'MMM DD YYYY HH:mm:ss' }),
                        winston.format.printf(({ timestamp, level, message, stack }) => {
                            const formattedMessage = typeof message === 'object' ? JSON.stringify(message) : message;
                            let msg = `${timestamp} [${level}] ${formattedMessage}`;
                            if (stack) {
                                const lines = (stack as string).split('\n');
                                msg += ` ${lines.join()}`;
                            }
                            return msg;
                        })
                    ),
                }),
            ],
        });
    }

    log(message: any) {
        this.logger.info(message);
    }

    error(message: any, trace: string) {
        this.logger.error(message, trace);
        if (trace) {
            const stackTrace = this.formatErrorStack(trace);
            this.logger.error(message, stackTrace);
        }
    }

    warn(message: any) {
        this.logger.warn(message);
    }

    debug(message: any) {
        this.logger.debug(message);
    }

    private formatErrorStack(stack: string) {
        const stackLines = stack.split('\n');
        const fileLocation = stackLines[1] || 'Unknown location';
        return `Error occurred at: ${fileLocation}`;
    }
}
