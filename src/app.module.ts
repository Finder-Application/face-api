import { Module } from '@nestjs/common';
import { FaceApiModule } from 'modules/face-api/face-api.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    FaceApiModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
