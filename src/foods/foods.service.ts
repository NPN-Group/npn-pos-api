import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Food, FoodDocument } from './schemas';
import { ShopsService } from '../shops/shops.service';
import { CreateFoodDto } from './dtos/create-food.dto';

@Injectable()
export class FoodsService {

    constructor(
        @InjectModel(Food.name) private foodModel: Model<FoodDocument>,
        private readonly shopsService: ShopsService,
    ) { }

    async create(createFoodDto: CreateFoodDto, shopId: string): Promise<FoodDocument> {

        if (!Types.ObjectId.isValid(shopId)) {
            throw new BadRequestException(`Invalid shopId: ${shopId}`);
        }

        const objectId = new Types.ObjectId(shopId);

        const shop = await this.shopsService.findOne(objectId);
        if (!shop) {
            throw new NotFoundException(`Shop with id ${shopId} not found`);
        }

        const food = new this.foodModel({
            ...createFoodDto,
            shop: objectId,
        });

        return food.save();
    }

    async findAll(shopId: string): Promise<FoodDocument[]> {

        if (!Types.ObjectId.isValid(shopId)) {
            throw new BadRequestException(`Invalid shopId: ${shopId}`);
        }

        const objectId = new Types.ObjectId(shopId);

        const shop = await this.shopsService.findOne(objectId);
        if (!shop) {
            throw new NotFoundException(`Shop with id ${shopId} not found`);
        }

        return this.foodModel.find({ shop: objectId });
    }

    async findOne(shopId: string, foodId: string): Promise<FoodDocument> {

        if (!Types.ObjectId.isValid(shopId)) {
            throw new BadRequestException(`Invalid shopId: ${shopId}`);
        }

        if (!Types.ObjectId.isValid(foodId)) {
            throw new BadRequestException(`Invalid foodId: ${foodId}`);
        }

        const objectId = new Types.ObjectId(shopId);

        const shop = await this.shopsService.findOne(objectId);
        if (!shop) {
            throw new NotFoundException(`Shop with id ${shopId} not found`);
        }

        const food = await this.foodModel.findOne({ _id: new Types.ObjectId(foodId), shop: objectId });
        if (!food) {
            throw new NotFoundException(`Food with id ${foodId} not found`);
        }

        return food;
    }

    async update(
        json: any,
        id: string,
        updateFoodDto: Partial<CreateFoodDto>
    ): Promise<FoodDocument> {

        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(`Invalid Food ID: ${id}`);
        }

        const food = await this.foodModel.findById(id);
        if (!food) {
            throw new NotFoundException(`Food with ID ${id} not found`);
        }

        const updateFood = await this.foodModel.findByIdAndUpdate(id, updateFoodDto, { new: true })
        if (!updateFood) {
            throw new BadRequestException(`Food with ID ${id} not found`);
        }
        console.log(updateFood);
        return updateFood;
    }

    async remove(shopId: string, foodId: string): Promise<void> {

        if (!Types.ObjectId.isValid(shopId)) {
            throw new BadRequestException(`Invalid shopId: ${shopId}`);
        }

        if (!Types.ObjectId.isValid(foodId)) {
            throw new BadRequestException(`Invalid foodId: ${foodId}`);
        }

        const objectId = new Types.ObjectId(shopId);

        const shop = await this.shopsService.findOne(objectId);
        if (!shop) {
            throw new NotFoundException(`Shop with id ${shopId} not found`);
        }

        const food = await this.foodModel.findOne({ _id: new Types.ObjectId(foodId), shop: objectId });
        if (!food) {
            throw new NotFoundException(`Food with id ${foodId} not found`);
        }

        await this.foodModel.deleteOne({ _id: new Types.ObjectId(foodId), shop: objectId });
    }

    async removeAll(shopId: string): Promise<void> {

        if (!Types.ObjectId.isValid(shopId)) {
            throw new BadRequestException(`Invalid shopId: ${shopId}`);
        }

        const objectId = new Types.ObjectId(shopId);

        const shop = await this.shopsService.findOne(objectId);
        if (!shop) {
            throw new NotFoundException(`Shop with id ${shopId} not found`);
        }

        await this.foodModel.deleteMany({ shop: objectId });
    }
}

