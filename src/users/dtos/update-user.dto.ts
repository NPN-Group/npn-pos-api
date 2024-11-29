import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
    @MinLength(8, { message: 'Password length must be at least 8 characters' })
    @IsString({ message: 'Password must be a string' })
    @IsOptional()
    password: string;

    @MinLength(1, { message: 'First name length must be at least 1 characters' })
    @IsString({ message: 'First name must be a string' })
    @IsOptional()
    firstName: string;

    @MinLength(1, { message: 'Last name length must be at least 1 characters' })
    @IsString({ message: 'Last name must be a string' })
    @IsOptional()
    lastName: string;
}
