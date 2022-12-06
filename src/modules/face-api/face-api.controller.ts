import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'utils';
import { ApiMultiFile } from './decorators/ApiFile';
import { DetectImageDto } from './dto/decectImage.dto';
import { FaceMatcherDto } from './dto/faceMatcher.dto';
import { FaceApiService } from './face-api.service';

@ApiTags('Face-apis ')
@Controller('')
export class FaceApiController {
  constructor(private faceApi: FaceApiService) {}

  @Post('/detect')
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile()
  @UseInterceptors(FilesInterceptor('files'))
  async detectImage(@UploadedFiles() files: DetectImageDto[]) {
    try {
      const data = await Promise.all(
        files.map((file) => this.faceApi.detectImage(file)),
      );
      return { data };
    } catch (error) {
      return ResponseMessage(error.errors[0].response, 'BAD_REQUEST');
    }
  }

  @Post('/face-matcher')
  @HttpCode(200)
  async compareFace(@Body() faceMatcherDto: FaceMatcherDto) {
    const { descriptors, descriptorCompare } = faceMatcherDto;
    return this.faceApi.faceMatcher(descriptors, descriptorCompare);
  }
}
