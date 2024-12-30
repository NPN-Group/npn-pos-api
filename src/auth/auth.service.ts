import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcryptjs";
import { UserDocument } from 'src/users/schemas/user.schema';
import { JwtPayloadSchema } from './dtos/jwt-payload.dto';
import { UserRole } from 'src/users/schemas';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dtos';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateCredential(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException("password is incorrect");
        }
        return user;
    }

    async validateUser(payload: { sub: string, role: UserRole }) {
        const user = await this.usersService.findById(new Types.ObjectId(payload.sub));
        if (!user) {
            throw new BadRequestException("user not found");
        }

        if (user.role !== payload.role) {
            throw new BadRequestException("user role is invalid");
        }

        return user;
    }

    async validateRefreshToken(id: string, refreshToken: string): Promise<boolean> {
        const user = await this.usersService.findById(new Types.ObjectId(id));
        if (!user) {
            throw new NotFoundException("user not found");
        }

        if (user.refreshToken !== refreshToken) {
            throw new BadRequestException("refresh token is invalid");
        }

        return true;
    }

    async refreshToken(user: UserDocument) {
        const token = await this.getToken(user._id.toString(), user.role);
        await this.usersService.updateRefreshToken(user._id, token.refreshToken);
        return token;
    }

    async register(createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);
        const token = await this.getToken(user._id.toString(), user.role);
        await this.usersService.updateRefreshToken(user._id, token.refreshToken);
        return {
            user,
            token,
        }
    }

    private async getToken(id: string, role: UserRole) {
        const nbf = Math.floor(Date.now() / 1000) + 30;
        const payload = { sub: id, role };
        const jwtPayload = JwtPayloadSchema.parse(payload);
        const jwtPayloadWithNbf = JwtPayloadSchema.parse({ ...payload, nbf });
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: process.env.ACCESS_TOKEN_SECRET,
                expiresIn: process.env.ACCESS_EXPIRES_IN,
            },
            ),
            this.jwtService.signAsync(jwtPayload, {
                secret: process.env.REFRESH_TOKEN_SECRET,
                expiresIn: process.env.REFRESH_EXPIRES_IN,
            },
            ),
        ]);

        return { accessToken, refreshToken };
    }

    async logout(user: UserDocument) {
        await this.usersService.updateRefreshToken(user._id, null);
    }
}
