import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';
import { UpdateOrderDto } from './dtos/update-order.dto';

@Injectable()
export class OrdersService {
    constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

    async create(createOrderDto: CreateOrderDto): Promise<OrderDocument> {
        const newOrder = new this.orderModel(createOrderDto);
        return newOrder.save();
    }

    async findAll(): Promise<OrderDocument[]> {

        return this.orderModel.find();
    }

    async findById(id: string | Types.ObjectId): Promise<OrderDocument> {
        const existingOrder = await this.orderModel.findById(id);
        if (!existingOrder){
          throw new NotFoundException(`Order with id ${id} not found`);
        }
        return existingOrder;
      }

    async remove(id: Types.ObjectId): Promise<OrderDocument> {
        const existingOrder = await this.orderModel.findByIdAndDelete(id);
        if (!existingOrder) {
            throw new NotFoundException(`Order with id ${id} not found`);
        }
        return existingOrder;
    }

    async update(id: Types.ObjectId, updateOrderDto: UpdateOrderDto): Promise<OrderDocument> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException(`Invalid ID format: ${id}`);
        }
    
        const existingOrder = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true });
    
        if (!existingOrder) {
            throw new NotFoundException(`Order with id ${id} not found`);
        }
    
        return existingOrder;
    }
    
}

