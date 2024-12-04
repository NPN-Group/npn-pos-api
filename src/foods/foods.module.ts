import { Module } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { FoodsController } from './foods.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopsModule } from 'src/shops/shops.module';
import { Food, FoodSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Food.name, schema: FoodSchema }]),
    ShopsModule,
],
  providers: [FoodsService],
  controllers: [FoodsController]
})
export class FoodsModule {}
