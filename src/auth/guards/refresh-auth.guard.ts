import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('jwt-refresh') {

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            if (info instanceof Error) {
                console.log("ERROR", info.message);
            }
            throw err || new UnauthorizedException('User not authorized');
        }
        return user;
    }
}