import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema } from './schemas/menu.schema';
import { FoodsModule } from 'src/foods/foods.module';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]),
    FoodsModule,OrdersModule
],
    
    controllers: [MenusController],
    providers: [MenusService],
    exports: [MenusService]
})
export class MenusModule {}
