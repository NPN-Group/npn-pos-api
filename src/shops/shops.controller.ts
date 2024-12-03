import { Controller, Get, Post, Body, Param, Patch, Delete, ForbiddenException, HttpStatus } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto, UpdateShopDto, FindOneParamsDto } from "./dtos";
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser, Roles } from 'src/common/decorators';
import { UserDocument, UserRole } from 'src/users/schemas';
import { Types } from 'mongoose';

@Controller('shops')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.ADMIN, UserRole.USER)
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) { }

  @Post()
  async create(@Body() createShopDto: CreateShopDto, @CurrentUser() user: UserDocument) {
    const res = await this.shopsService.create(createShopDto, user._id);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Shop created successfully',
      data: res,
    }
  }

  @Get()
  async findAll(@CurrentUser() user: UserDocument) {
    let res;
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
  async update(@Param() { id }: FindOneParamsDto, @Body() updateShopDto: UpdateShopDto, @CurrentUser() user: UserDocument) {
    const shop = await this.shopsService.findOne(new Types.ObjectId(id));

    if (shop.owner.equals(user.id)) {
      const res = await this.shopsService.update(new Types.ObjectId(id), updateShopDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Shop updated successfully',
        data: res
      }
    }

    throw new ForbiddenException("You don't have permission to access this resource");
  }

  @Delete(':id')
  async remove(@Param() { id }: FindOneParamsDto, @CurrentUser() user: UserDocument) {
    const shop = await this.shopsService.findOne(new Types.ObjectId(id));

    if (shop.owner.equals(user.id) || user.role === UserRole.ADMIN) {
      await this.shopsService.remove(new Types.ObjectId(id));
      return {
        statusCode: HttpStatus.OK,
        message: 'Shop deleted successfully',
      }
    }

    throw new ForbiddenException("You don't have permission to access this resource");
  }
}
