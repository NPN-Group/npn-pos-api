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
  BadRequestException
} from '@nestjs/common';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ShopsService } from './shops.service';
import { CreateShopDto, UpdateShopDto, FindOneParamsDto, CreateShopSchema, UpdateShopSchema } from "./dtos";
import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser, Roles } from 'src/common/decorators';
import { UserDocument, UserRole } from 'src/users/schemas';
import { checkFileNameEncoding, generateRandomFileName } from 'src/common/utills';

@Controller('shops')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.ADMIN, UserRole.USER)
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
  async create(@Body("json") json: any, @CurrentUser() user: UserDocument, @UploadedFile() image: Express.Multer.File) {

    // const jsonParsed = JSON.parse(json);
    // const createShopDto = {
    //   ...jsonParsed,
    //   img: image?.filename || null,
    // } as CreateShopDto;

    let jsonParsed
    try {
      jsonParsed = JSON.parse(json)
    } catch (error) {
      throw new BadRequestException("Invalid JSON format in 'json' field")
    }

    const createShopDto = {
      ...jsonParsed,
      img: image?.filename || null,
    } as CreateShopDto;
  

    const data = CreateShopSchema.parse(createShopDto);

    const res = await this.shopsService.create(data, user._id);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Shop created successfully',
      data: res,
    }
  }

  @Get()
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
  async update(@Param() { id }: FindOneParamsDto, @Body("json") json: any, @CurrentUser() user: UserDocument, @UploadedFile() image: Express.Multer.File) {
    const jsonParsed = JSON.parse(json);
    let updateShopDto = {
      ...jsonParsed,
      img: image?.filename,
    } as UpdateShopDto;

    const data = UpdateShopSchema.parse(updateShopDto);

    const objectId = new Types.ObjectId(id);
    const shop = await this.shopsService.findOne(objectId);

    if (shop.owner.equals(user.id)) {
      const res = await this.shopsService.update(objectId, data);
      return {
        statusCode: HttpStatus.OK,
        message: 'Shop updated successfully',
        data: res
      }
    }

    throw new ForbiddenException("You don't have permission to access this resource");
  }

  @Delete()
  async removeAll(@CurrentUser() user: UserDocument) {
    if (user.role === UserRole.ADMIN) {
      await this.shopsService.removeAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'All shops deleted successfully',
      }
    }

    throw new ForbiddenException("You don't have permission to access this resource");
  }

  @Delete(':id')
  async remove(@Param() { id }: FindOneParamsDto, @CurrentUser() user: UserDocument) {
    const objectId = new Types.ObjectId(id);
    const shop = await this.shopsService.findOne(objectId);

    if (shop.owner.equals(user.id) || user.role === UserRole.ADMIN) {
      await this.shopsService.remove(objectId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Shop deleted successfully',
      }
    }

    throw new ForbiddenException("You don't have permission to access this resource");
  }
}
