import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import {
  AuthModule,
  UsersModule,
} from 'src';
import { ShopsModule } from './shops/shops.module';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
import { FoodsModule } from './foods/foods.module';
import { TicketsModule } from './tickets/tickets.module';
import { TablesModule } from './tables/tables.module';
import { MenusController } from './menus/menus.controller';
import { MenusService } from './menus/menus.service';
import { MenusModule } from './menus/menus.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './uploads',
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/attachments/',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UsersModule,
    AuthModule,
    ShopsModule,
    FoodsModule,
    TablesModule,
    TicketsModule,
    MenusModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
