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
import { TablesService } from '../tables/tables.service';
import { CreateShopDto, UpdateShopDto, FindOneParamsDto } from "./dtos";
import { CreateTableDto } from '../tables/dto/create-table.dto';
import {UpdateTableDto} from '../tables/dto/update-table.dto';
import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser, Roles } from 'src/common/decorators';
import { UserDocument, UserRole } from 'src/users/schemas';
import { checkFileNameEncoding, generateRandomFileName } from 'src/common/utills';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('shops')
@UseGuards(JwtAuthGuard)
export class ShopsController {
  constructor(
    private readonly shopsService: ShopsService,
    private readonly tablesService: TablesService, // ✅ Inject TablesService
  ) {}
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
  @Post(':shopId/tables')
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  async createTable(
    @Param('shopId') shopId: string,
    @Body() createTableDto: CreateTableDto,
    @CurrentUser() user: UserDocument
  ) {
    const shop = await this.shopsService.findOne(new Types.ObjectId(shopId));
    if (!shop.owner.equals(user.id)) {
      throw new ForbiddenException("You don't have permission to manage tables in this shop");
    }

    const newTable = await this.tablesService.create(new Types.ObjectId(shopId), createTableDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Table added successfully',
      data: newTable,
    }
  }
  @Get(':shopId/tables')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(RolesGuard)
  async getAllTables(@Param('shopId') shopId: string) {
    const tables = await this.tablesService.findAll(new Types.ObjectId(shopId));
    return {
      statusCode: HttpStatus.OK,
      message: 'Tables fetched successfully',
      data: tables,
    }
  }
  @Get(':shopId/tables/:tableId')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(RolesGuard)
  async getTable(
    @Param('shopId') shopId: string,
    @Param('tableId') tableId: string
  ) {
    const table = await this.tablesService.findById(new Types.ObjectId(shopId), new Types.ObjectId(tableId));
    return {
      statusCode: HttpStatus.OK,
      message: 'Table details fetched successfully',
      data: table,
    }
  }
  @Patch(':shopId/tables/:tableId')
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  async updateTable(
    @Param('shopId') shopId: string,
    @Param('tableId') tableId: string,
    @Body() updateTableDto: UpdateTableDto,
    @CurrentUser() user: UserDocument
  ) {
    const shop = await this.shopsService.findOne(new Types.ObjectId(shopId));
    if (!shop.owner.equals(user.id)) {
      throw new ForbiddenException("You don't have permission to update tables in this shop");
    }

    const updatedTable = await this.tablesService.update(
      new Types.ObjectId(shopId),
      new Types.ObjectId(tableId),
      updateTableDto
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Table updated successfully',
      data: updatedTable,
    }
  }
  @Delete(':shopId/tables/:tableId')
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  async deleteTable(
    @Param('shopId') shopId: string,
    @Param('tableId') tableId: string,
    @CurrentUser() user: UserDocument
  ) {
    const shop = await this.shopsService.findOne(new Types.ObjectId(shopId));
    if (!shop.owner.equals(user.id)) {
      throw new ForbiddenException("You don't have permission to delete tables in this shop");
    }

    await this.tablesService.remove(new Types.ObjectId(shopId), new Types.ObjectId(tableId));

    return {
      statusCode: HttpStatus.OK,
      message: 'Table deleted successfully',
    }
  }
}
