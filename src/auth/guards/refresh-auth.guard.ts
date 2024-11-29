import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDocument } from 'src/users/schemas';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('jwt-refresh') {

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