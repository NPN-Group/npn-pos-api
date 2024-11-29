import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dtos';
import * as bcrypt from "bcryptjs";
import { UserRole } from './schemas';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        const existingUser = await this.userModel.findOne({ email: createUserDto.email });
        if (existingUser) {
            throw new BadRequestException(`User with email ${createUserDto.email} already exists`);
        }
        createUserDto.role = UserRole.USER;
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
        const existingUser = await this.userModel.findById(id);
        if (!existingUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        Object.assign(existingUser, updateUserDto);

        return existingUser.save();
    }

    async updateRefreshToken(id: string, refreshToken: string | null): Promise<UserDocument> {
        const existingUser = await this.userModel.findById(id);
        if (!existingUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        existingUser.refreshToken = refreshToken;
        return existingUser.save();
    }

    async findByEmail(email: string): Promise<UserDocument> {
        const existingUser = await this.userModel.findOne({ email });
        if (!existingUser) {
            throw new NotFoundException(`User with email ${email} not found`);
        }
        return existingUser;
    }

    async findById(id: string): Promise<UserDocument> {
        const existingUser = await this.userModel.findById(id);
        if (!existingUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return existingUser;
    }
}
