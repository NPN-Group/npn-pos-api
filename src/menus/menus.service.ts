import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Menu, MenuDocument } from './schemas/menu.schema';
import { OrdersService } from 'src/orders/orders.service';
import { FoodsService } from 'src/foods/foods.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateMenuDto } from './dtos/create-menu.dtos';
import { UpdateMenuDto, UpdateMenuSchema } from './dtos/update-menu.dtos';

@Injectable()
export class MenusService {
    constructor(
        @InjectModel(Menu.name) private readonly menusModel: Model<MenuDocument>,
        private readonly ordersService: OrdersService,
        private readonly foodsService: FoodsService,
    ) {}

    async create(createMenuDto: CreateMenuDto): Promise<MenuDocument> {
        if(!Types.ObjectId.isValid(createMenuDto.food)) {
            throw new BadRequestException(`Invalid foodId: ${createMenuDto.food}`);
        }

        if(!Types.ObjectId.isValid(createMenuDto.order)) {
            throw new BadRequestException(`Invalid orderId: ${createMenuDto.order}`);
        }

        const food = await this.foodsService.findOne(createMenuDto.food);
        if(!food) {
            throw new BadRequestException(`Food with id ${createMenuDto.food} not found`);
        }

        const order = await this.ordersService.findById(Object(createMenuDto.order));
        if(!order) {
            throw new BadRequestException(`Order with id ${createMenuDto.order} not found`);
        }

        const newMenu = new this.menusModel(createMenuDto);
        return newMenu.save();
    }

    async findAll(orderId: string): Promise<MenuDocument[]> {
        if (!Types.ObjectId.isValid(orderId)) {
            throw new BadRequestException(`Invalid orderId: ${orderId}`);
        }
    
        const order = await this.ordersService.findById(orderId);
        if (!order) {
            throw new BadRequestException(`Order with id ${orderId} not found`);
        }
    
        console.log('Order found:', order);
    
        const results = await this.menusModel.find({ order: orderId }).populate('food');
        console.log('Query Results:', results);
    
        return results;
    }

    async remove(id: Types.ObjectId, orderId: string): Promise<MenuDocument> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(`Invalid menuId: ${id}`);
        }
    
        if (!Types.ObjectId.isValid(orderId)) {
            throw new BadRequestException(`Invalid orderId: ${orderId}`);
        }
    
        const existingMenu = await this.menusModel.findByIdAndDelete(id);
        if (!existingMenu) {
            throw new NotFoundException(`Menu with id ${id} not found`);
        }
    
        return existingMenu;
    }

    async update(id: string, updateMenuDto: Partial<UpdateMenuDto>): Promise<MenuDocument> {
        // Validate menu ID
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(`Invalid menuId: ${id}`);
        }

        const parsed = UpdateMenuSchema.safeParse(updateMenuDto);
        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.issues.map((issue) => issue.message).join(', ')
            );
        }
    
        const { order, food, quantity, describe } = parsed.data;
    
        const updateData: Partial<UpdateMenuDto> = {};
        if (order) updateData.order = order;
        if (food) updateData.food = food;
        if (quantity !== undefined && quantity !== null) updateData.quantity = quantity;
        if (describe !== undefined && describe !== null) updateData.describe = describe;
    
        const existingMenu = await this.menusModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        if (!existingMenu) {
            throw new NotFoundException(`Menu with id ${id} not found`);
        }
    
        return existingMenu;
    }
    
}
