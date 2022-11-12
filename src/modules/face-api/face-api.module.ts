import { Module } from '@nestjs/common';
import { FaceApiController } from './face-api.controller';
import { FaceApiService } from './face-api.service';
import { ApiConfigService } from 'configs/apiConfig.service';

@Module({
  controllers: [FaceApiController],
  providers: [FaceApiService, ApiConfigService],
  exports: [FaceApiService, ApiConfigService],
})
export class FaceApiModule {}
