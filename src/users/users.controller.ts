import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDocument, UserRole } from './schemas';
import { JwtAuthGuard } from 'src/auth/guards';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);
    return {
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
    const result = await this.usersService.update(user._id.toString(), updateUserDto);
    return {
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
      message: "fetch user success",
      data: {
        user,
      },
    };
  }
}
