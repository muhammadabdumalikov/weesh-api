import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const HTTP_PORT = process.env.HTTP_PORT || 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*' },
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  const docConfig = new DocumentBuilder()
    .setTitle('Weesh API')
    .setDescription('Wishlist API for Weesh app')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(HTTP_PORT, () =>
    console.log(
      `Weesh API running at http://localhost:${HTTP_PORT}/api, Swagger at http://localhost:${HTTP_PORT}/swagger`,
    ),
  );
}
bootstrap();
