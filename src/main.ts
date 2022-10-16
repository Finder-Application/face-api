import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import initFaceApi from 'initFaceApi';
import configSwagger from 'swagger';
import { loggerWinston } from 'utils/logger';
import { AppModule } from './app.module';
import { GLOBAL_PATH, PATH_DOCUMENT } from './constants';
import { json } from 'body-parser';
async function bootstrap() {
  await initFaceApi();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(json({ limit: '100mb' }));
  app.setGlobalPrefix(GLOBAL_PATH);
  app.useGlobalPipes(
    new ValidationPipe({
      transformerPackage: require('class-transformer'),
    }),
  );

  const document = SwaggerModule.createDocument(app, configSwagger);
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
