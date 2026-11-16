import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:4200' });

  const doc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('Findings API').build(),
  );
  SwaggerModule.setup('docs', app, doc);

  await app.listen(3000);
}
bootstrap();