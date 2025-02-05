import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from './schemas/shop.schema';
import { UsersModule } from 'src/users/users.module';
import { TablesModule } from '../tables/tables.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]),
    UsersModule,
    TablesModule, 
  ],
  controllers: [ShopsController],
  providers: [ShopsService], 
  exports: [ShopsService],
})
export class ShopsModule {}
