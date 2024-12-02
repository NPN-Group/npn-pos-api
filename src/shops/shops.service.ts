import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop, ShopDocument } from './schemas/shop.schema';
import { CreateShopDto } from './dtos/create-shop.dto';

@Injectable()
export class ShopsService {
  constructor(@InjectModel(Shop.name) private shopModel: Model<ShopDocument>) {}
/**
   * Create a new shop.
   * @param createShopDto - Data for the shop.
   * @param owner - The owner's user ID.
   * @returns The created shop document.
   */
    async create(createShopDto: CreateShopDto, owner: string): Promise<ShopDocument> {
        const shop = new this.shopModel({ ...createShopDto, owner });
        return shop.save();
    }
  
    /**
   * Retrieve all shops for a specific user.
   * @param owner - The owner's user ID.
   * @returns An array of shop documents.
   */
    async findAllByOwner(owner: string): Promise<Shop[]> {
        return this.shopModel.find({ owner }).exec();
      }

  async findAll(): Promise<Shop[]> {
    return this.shopModel.find().populate('owner').exec();
  }

  async findOne(id: string): Promise<Shop> {
    return this.shopModel.findById(id).populate('owner').exec();
  }

  async update(id: string, updateShopDto: Partial<Shop>): Promise<Shop | null> {
    return this.shopModel.findByIdAndUpdate(id, updateShopDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Shop | null> {
    return this.shopModel.findByIdAndDelete(id).exec();
  }
}
