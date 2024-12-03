import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser, Roles } from 'src/common/decorators';
import { UserDocument, UserRole } from 'src/users/schemas';
import { FoodsService } from './foods.service';
import { CreateFoodSchema, CreateFoodDto } from './dtos/create-food.dto';

@Controller('foods')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.USER)
export class FoodsController {
    constructor(private readonly foodsService: FoodsService) {}

    @Post()
    async create(
        @Body("json") json: any, 
        @CurrentUser() user: UserDocument
    ) {
        let createFoodDto: CreateFoodDto;

        try {
            createFoodDto = CreateFoodSchema.parse(json);
        } catch (error) {
            throw new BadRequestException(error.errors.map((e) => e.message).join(', '));
        }

        if (user.role === UserRole.ADMIN) {
            throw new BadRequestException('Admins cannot create food.');
        }

        const data = CreateFoodSchema.parse(createFoodDto);

        const res = await this.foodsService.create(data, data.shop);
        return {
            statusCode : HttpStatus.OK,
            message : 'Food created successfully',
            data : res
        }

    }

    @Get()
    async findAll(
        @Body("json") {shop}, 
        @CurrentUser() user: UserDocument
    ) {
        if (!shop) {
            throw new BadRequestException('shopId is required');
        }

        const res = await this.foodsService.findAll(shop);
        return {
            statusCode : HttpStatus.OK,
            message : 'All Foods fetched successfully',
            data : res
        }
        
    }

    @Get(':id')
    async findOne(
        @Body("json") {shop}, 
        @Param ('id') id: string,
        @CurrentUser() user: UserDocument
    ) {
        if (!shop) {
            throw new BadRequestException('shopId is required');
        }

        const res = await this.foodsService.findOne(shop, id);
        return {
            statusCode : HttpStatus.OK,
            message : 'Food fetched successfully',
            data : res
        }
    }

    @Patch(':id')
    async update(
        @Body("json") json: any, 
        @Param('id') id: string,
        @CurrentUser() user: UserDocument
    ) {
        let updateFoodDto: CreateFoodDto;

        try {
            updateFoodDto = CreateFoodSchema.parse(json);
        } catch (error) {
            throw new BadRequestException(error.errors.map((e) => e.message).join(', '));
        }

        const data = CreateFoodSchema.parse(updateFoodDto);

        const res = await this.foodsService.update(json,id, data);
        return {
            statusCode : HttpStatus.OK,
            message : 'Food updated successfully',
            data : res
        }
    }

    @Delete(':id')
    async remove(
        @Body("json") {shop}, 
        @Param('id') id: string,
        @CurrentUser() user: UserDocument
    ) {
        if (!shop) {
            throw new BadRequestException('shopId is required');
        }

        await this.foodsService.remove(shop, id);
        return {
            statusCode : HttpStatus.OK,
            message : 'Food removed successfully'
        }
    }
    
    @Delete()
    async removeAll(
        @Body("json") {shop}, 
        @CurrentUser() user: UserDocument
    ) {
        if (!shop) {
            throw new BadRequestException('shopId is required');
        }

        await this.foodsService.removeAll(shop);
        return {
            statusCode : HttpStatus.OK,
            message : 'All Foods removed successfully'
        }
    }
}
