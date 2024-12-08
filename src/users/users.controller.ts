import { Body, Controller, Get, HttpStatus, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UpdateUserSchema } from './dtos';
import { CurrentUser, Roles } from 'src/common/decorators';
import { UserDocument, UserRole } from './schemas';
import { JwtAuthGuard } from 'src/auth/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { checkFileNameEncoding, generateRandomFileName } from 'src/common/utills';

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
      data: result,
    };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: "create user success",
      data: result,
    };
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: "./uploads",
        filename: (_, file, cb) => {
          const [originalFilename, fileExt] = file.originalname.split('.');
          const extension = file.mimetype.split("/")[1];
          let filename: string;
          const id = Date.now();
          if (!checkFileNameEncoding(originalFilename)) filename = `${generateRandomFileName()}-${id}.${extension}`;
          else filename = `${originalFilename}-${id}.${extension}`;
          cb(null, filename);
        },
      }),
      limits: { fileSize: 1024 * 1024 * 10 },
      fileFilter: (_, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new Error('File type not supported'), false);
        }
      }
    })
  )
  async update(@CurrentUser() user: UserDocument, @Body() { json }: any, @UploadedFile() image: Express.Multer.File) {
    const jsonParsed = JSON.parse(json);
    if (image && image.filename) {
      jsonParsed.img = image?.filename;
    }
    const updateUserDto = UpdateUserSchema.parse(jsonParsed);
    const result = await this.usersService.update(user._id, updateUserDto);

    return {
      statusCode: HttpStatus.OK,
      message: "update user success",
      data: result
    };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  getMe(@CurrentUser() user: UserDocument) {
    return {
      statusCode: HttpStatus.OK,
      message: "fetch user success",
      data: user
    };
  }
}
