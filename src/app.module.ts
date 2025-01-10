import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { MulterModule } from '@nestjs/platform-express';
import {
  AuthModule,
  UsersModule,
  FoodsModule,
  TicketsModule,
  TablesModule,
  MenusModule,
  ShopsModule
} from 'src';
import { LoggerModule } from './common/loggers';

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
      serveRoot: '/uploads/',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    LoggerModule,
    UsersModule,
    AuthModule,
    ShopsModule,
    FoodsModule,
    TablesModule,
    TicketsModule,
    MenusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
