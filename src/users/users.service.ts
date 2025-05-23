import { BadRequestException, Injectable, NotFoundException, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
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
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async update(id: Types.ObjectId, updateUserDto: UpdateUserDto): Promise<UserDocument> {
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

    async updateRefreshToken(id: Types.ObjectId, refreshToken: string | null): Promise<UserDocument> {
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

    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find();
    }

    async findById(id: Types.ObjectId): Promise<UserDocument> {
        const existingUser = await this.userModel.findById(id);
        if (!existingUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return existingUser;
    }
}
