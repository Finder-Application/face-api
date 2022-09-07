import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GLOBAL_PATH, PATH_DOCUMENT } from './constants';
import { ValidationPipe } from '@nestjs/common';
import { loggerWinston } from 'utils/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(GLOBAL_PATH);
  app.useGlobalPipes(
    new ValidationPipe({
      transformerPackage: require('class-transformer'),
    }),
  );
  // * setup documents
  // TODO: Write more information for documents
  const config = new DocumentBuilder()
    .setTitle('Hybrid bot Api Documentation')
    .setDescription('The Hybrid API description .........')
    .setVersion('1.0')
    .addTag('Hybrid')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${PATH_DOCUMENT}`, app, document);

  // config listen
  await app.listen(process.env.PORT || 4000);
  const API_URL = await app.getUrl();
  loggerWinston.info(
    `======= Api ======== : Application is running on: ${API_URL}`,
  );
  loggerWinston.info(
    `======= Docs ======= : Application is running on: ${API_URL}/${PATH_DOCUMENT}`,
  );
}
bootstrap();
