import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { UserRole } from "../schemas";

export class CreateUserDto {
    @IsEmail({}, { message: 'Invalid email format' })
    @IsString({ message: 'Email must be a string' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @MinLength(8, { message: 'Password length must be at least 8 characters' })
    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @MinLength(1, { message: 'First name length must be at least 1 characters' })
    @IsString({ message: 'First name must be a string' })
    @IsNotEmpty({ message: 'First name is required' })
    firstName: string;

    @MinLength(1, { message: 'Last name length must be at least 1 characters' })
    @IsString({ message: 'Last name must be a string' })
    @IsNotEmpty({ message: 'Last name is required' })
    lastName: string;

    @IsEnum(UserRole, { message: 'Role is invalid' })
    @IsString({ message: 'Role must be a string' })
    @IsNotEmpty({ message: 'Role is required' })
    role: UserRole;
}
