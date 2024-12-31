import { Module, Global } from '@nestjs/common';
import { WinstonLoggerService } from './winston-logger.service';

@Global()
@Module({
    providers: [
        {
            provide: 'LoggerService',
            useClass: WinstonLoggerService,
        },
    ],
    exports: [
        {
            provide: 'LoggerService',
            useClass: WinstonLoggerService,
        },
    ],
})
export class LoggerModule { }
