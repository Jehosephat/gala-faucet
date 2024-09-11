import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json());
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.listen(3001);
}
bootstrap();
