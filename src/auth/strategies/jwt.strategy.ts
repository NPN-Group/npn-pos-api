import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { JwtPayload, JwtPayloadSchema } from '../dtos/jwt-payload.dto';
import { UserDocument } from 'src/users/schemas';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
                return req?.cookies?.accessToken;
            }]),
            ignoreExpiration: false,
            secretOrKey: process.env.ACCESS_TOKEN_SECRET,
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