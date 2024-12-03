import { Body, Controller, Get, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { CurrentUser, Roles } from 'src/common/decorators';
import { UserDocument, UserRole } from './schemas';
import { JwtAuthGuard } from 'src/auth/guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    const result = await this.usersService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: "fetch users success",
      data: {
        users: result,
      },
    };
  }
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: "create user success",
      data: {
        user: result,
      },
    };
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async update(@CurrentUser() user: UserDocument, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.update(user._id, updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: "update user success",
      data: {
        user: result,
      },
    };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: UserDocument) {
    return {
      statusCode: HttpStatus.OK,
      message: "fetch user success",
      data: {
        user,
      },
    };
  }
}
