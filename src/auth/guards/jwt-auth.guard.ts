import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any) {
        console.log("[INFO] info", info);
        if (err || !user) {
            console.log('[ERROR] Authentication failed', err);
            throw err || new UnauthorizedException('User not authorized');
        }
        console.log('[INFO] Authentication success', user);
        return user;
    }
}