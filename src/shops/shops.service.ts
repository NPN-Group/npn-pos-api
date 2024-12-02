import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Shop, ShopDocument } from './schemas';
import { CreateShopDto, UpdateShopDto } from './dtos';

@Injectable()
export class ShopsService {
  constructor(@InjectModel(Shop.name) private shopModel: Model<ShopDocument>) { }

  async create(createShopDto: CreateShopDto, ownerId: Types.ObjectId): Promise<ShopDocument> {
    const shop = new this.shopModel({
      ...createShopDto,
      owner: ownerId,
    })

    return shop.save();
  }

  async findAll(): Promise<ShopDocument[]> {
    return this.shopModel.find().populate('owner');
  }

  async findByOwner(ownerId: Types.ObjectId): Promise<ShopDocument[]> {
    return this.shopModel.find({ owner: ownerId }).populate('owner');
  }

  async findOne(id: Types.ObjectId): Promise<ShopDocument> {
    const shop = await this.shopModel.findById(id).populate('owner');
    if (!shop) {
      throw new NotFoundException(`Shop with id ${id} not found`);
    }

    return shop;
  }

  async update(id: Types.ObjectId, updateShopDto: UpdateShopDto): Promise<ShopDocument> {
    const shop = await this.shopModel.findByIdAndUpdate(id, updateShopDto, { new: true }).populate('owner');
    if (!shop) {
      throw new NotFoundException(`Shop with id ${id} not found`);
    }

    return shop;
  }

  async remove(id: Types.ObjectId): Promise<void> {
    const shop = await this.shopModel.findByIdAndDelete(id).populate('owner');
    if (!shop) {
      throw new NotFoundException(`Shop with id ${id} not found`);
    }
  }

}
