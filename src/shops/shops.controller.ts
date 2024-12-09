import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ForbiddenException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ShopsService } from './shops.service';
import { CreateShopDto, UpdateShopDto, FindOneParamsDto } from "./dtos";
import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser, Roles } from 'src/common/decorators';
import { UserDocument, UserRole } from 'src/users/schemas';
import { checkFileNameEncoding, generateRandomFileName } from 'src/common/utills';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('shops')
@UseGuards(JwtAuthGuard)
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) { }

  @Post()
  @UseInterceptors(
    FileInterceptor('shop-image', {
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
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createShopDto: CreateShopDto, @CurrentUser() user: UserDocument, @UploadedFile() image: Express.Multer.File) {
    const res = await this.shopsService.create(createShopDto, user._id, image?.filename);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Shop created successfully',
      data: res,
    }
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(RolesGuard)
  async findAll(@CurrentUser() user: UserDocument) {
    let res = {};
    if (user.role === UserRole.ADMIN) {
      res = await this.shopsService.findAll();
    } else if (user.role === UserRole.USER) {
      res = await this.shopsService.findByOwner(user._id);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Shops fetched successfully',
      data: res,
    }
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(RolesGuard)
  async findOne(@Param() { id }: FindOneParamsDto, @CurrentUser() user: UserDocument) {
    const shop = await this.shopsService.findOne(new Types.ObjectId(id));
    if (user.role === UserRole.ADMIN || shop.owner.equals(user.id)) {
      return {
        statusCode: HttpStatus.OK,
        message: 'Shop fetched successfully',
        data: shop,
      }
    }

    throw new ForbiddenException("You don't have permission to access this resource");
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('shop-image', {
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
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  async update(@Param() { id }: FindOneParamsDto, @Body() updateShopDto: UpdateShopDto, @CurrentUser() user: UserDocument, @UploadedFile() image: Express.Multer.File) {
    const objectId = new Types.ObjectId(id);
    const { owner } = await this.shopsService.findOne(objectId);
    if (!owner.equals(user.id)) {
      throw new ForbiddenException("You don't have permission to access this resource");
    }
    const res = await this.shopsService.update(updateShopDto, objectId, image?.filename);
    return {
      statusCode: HttpStatus.OK,
      message: 'Shop updated successfully',
      data: res
    }
  }

  @Delete()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async removeAll() {
    await this.shopsService.removeAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'All shops deleted successfully',
    }
  }

  @Delete(':id')
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  async remove(@Param() { id }: FindOneParamsDto, @CurrentUser() user: UserDocument) {
    const objectId = new Types.ObjectId(id);
    const { id: shopId, owner } = await this.shopsService.findOne(objectId);
    if (!owner.equals(user.id)) {
      throw new BadRequestException("Shop ID miss match with owner");
    }
    await this.shopsService.remove(shopId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Shop deleted successfully',
    }
  }
}
