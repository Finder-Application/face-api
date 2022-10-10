import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DetectImageDto } from './dto/decectImage.dto';
import { FaceMatcherDto } from './dto/faceMatcher.dto';
import { FaceApiService } from './face-api.service';

@ApiTags('Face-apis ')
@Controller('')
export class FaceApiController {
  constructor(private faceApi: FaceApiService) {}
  @Post('/detect')
  async detectImage(@Body() detectImageDto: DetectImageDto) {
    const { files } = detectImageDto;
    return Promise.all(files.map((file) => this.faceApi.detectImage(file)));
  }

  @Post('/face-matcher')
  async compareFace(@Body() faceMatcherDto: FaceMatcherDto) {
    const { descriptor1, descriptor2 } = faceMatcherDto;
    return this.faceApi.faceMatcher(descriptor1, descriptor2);
  }
}
