import { Module } from '@nestjs/common';
import { FaceApiModule } from 'modules/face-api/face-api.module';

@Module({
  imports: [FaceApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
