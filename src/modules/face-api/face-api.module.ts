import { Module } from '@nestjs/common';
import { FaceApiController } from './face-api.controller';
import { FaceApiService } from './face-api.service';

@Module({
  controllers: [FaceApiController],
  providers: [FaceApiService],
  exports: [FaceApiService],
})
export class FaceApiModule {}
