import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { ShopsModule } from 'src/shops/shops.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
        ShopsModule
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule {}
