import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser, Roles } from 'src/common/decorators';
import { UserRole } from 'src/users/schemas';
import { OrdersService } from './orders.service';
import { CreateOrderDto, CreateOrderSchema } from './dtos/create-order.dto';
import { Types } from 'mongoose';
import { UpdateOrderDto } from './dtos/update-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.USER)
export class OrdersController {
    constructor(private readonly orderService: OrdersService) {}

    @Post()
    async create(@Body() createOrderDto: CreateOrderDto) {
        const res = await this.orderService.create(createOrderDto);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Order created successfully',
            data: res
        }
    }

    @Get()
    async findAll(@Body() {shop}) {

        const res = await this.orderService.findAll();
        return{
            statusCode: HttpStatus.OK,
            message: 'Orders fetched successfully',
            data: res
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: Types.ObjectId) {
        const res = await this.orderService.findById(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Order fetched successfully',
            data: res
        }
    }

    @Patch(':id')
    async update(@Param('id') id: Types.ObjectId, @Body() updateOrderDto: UpdateOrderDto) {
        const res = await this.orderService.update(id, updateOrderDto);
        return {
            statusCode: HttpStatus.OK,
            message: 'Order updated successfully',
            data: res
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: Types.ObjectId) {
        const res = await this.orderService.remove(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Order deleted successfully',
            data: res
        }
    }
}
