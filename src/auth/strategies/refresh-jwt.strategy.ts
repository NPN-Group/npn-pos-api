import { ForbiddenException, Inject, Injectable, LoggerService } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { JwtPayload, JwtPayloadSchema } from '../dtos/jwt-payload.dto';
import { UserDocument } from 'src/users/schemas';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly authService: AuthService,
        @Inject('LoggerService') private readonly logger: LoggerService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
                this.logger.log(`[from Refresh Auth Guard] accessToken ${req?.cookies?.accessToken}`);
                this.logger.log(`[from Refresh Auth Guard] refreshToken ${req?.cookies?.refreshToken}`);
                return req?.cookies?.refreshToken;
            }]),
            ignoreExpiration: false,
            secretOrKey: process.env.REFRESH_TOKEN_SECRET,
        });
    }

    async validate(payload: JwtPayload): Promise<UserDocument> {
        const jwtPayload = JwtPayloadSchema.safeParse(payload);
        if (!jwtPayload.success) {
            throw new ForbiddenException('Invalid token');
        }
        return this.authService.validateUser({ sub: jwtPayload.data.sub, role: jwtPayload.data.role });
    }
}
