import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/filters/all-filter-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.SERVER_PORT || 3000;
  const host = process.env.SERVER_HOST || '127.0.0.1';
  const nodeEnv = process.env.NODE_ENV || 'development';

  let corsOrigin: string[] = [];
  if (nodeEnv === 'production') {
    const prodCorsOrigin = process.env.PROD_FRONTEND_URLS;
    corsOrigin = prodCorsOrigin ? prodCorsOrigin.split(',') : [];
  } else {
    const devCorsOrigin = process.env.DEV_FRONTEND_URLS;
    corsOrigin = devCorsOrigin ? devCorsOrigin.split(',') : [];
  }

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  app.use(cookieParser());
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  app.setGlobalPrefix('api');

  await app.listen(port, host);
  console.log(`Server is running on: ${await app.getUrl()}`);
}

bootstrap();
