import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { Roles } from 'src/common/decorators';
import { FoodsService } from 'src/foods/foods.service';
import { UserRole } from 'src/users/schemas';
import { CreateMenuDto } from './dtos/create-menu.dtos';
import { MenusService } from './menus.service';
import { Types } from 'mongoose';
import { UpdateMenuDto } from './dtos/update-menu.dtos';

@Controller('menus')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.USER)
export class MenusController {
    constructor(private readonly menuService: MenusService) {}

    @Post()
    async create(@Body() createMenuDto: CreateMenuDto) {
        const res = await this.menuService.create(createMenuDto);
        return {
            statusCode: 201,
            message: 'Menu created successfully',
            data: res
        }
    }

    @Get()
    async findAll(@Body() {order}) {

        console.log(order)
        const res = await this.menuService.findAll(order);
        return {
            statusCode: 200,
            message: 'Menus fetched successfully',
            data: res
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: Types.ObjectId, @Body() {order}) {
        const res = await this.menuService.remove(id, order);
        return {
            statusCode: 200,
            message: 'Menu deleted successfully',
            data: res
        }
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
        const res = await this.menuService.update(id, updateMenuDto);
        return {
            statusCode: 200,
            message: 'Menu updated successfully',
            data: res
        }
    }

}
