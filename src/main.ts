import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  console.log("Hola como estas");
  console.log("Hola como estas");
  console.log("Hola como estas desde github 2");
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
