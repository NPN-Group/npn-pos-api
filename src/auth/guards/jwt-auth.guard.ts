import { Inject, Injectable, LoggerService, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(@Inject('LoggerService') private readonly logger: LoggerService) {
        super();
    }
    handleRequest(err: any, user: any, info: any) {
        if (info instanceof Error) {
            console.log("[ERROR]", info.message);
            this.logger.error(info.message);
        }
        if (err || !user) {
            throw err || new UnauthorizedException('User not authorized');
        }
        return user;
    }
}