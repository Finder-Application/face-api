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
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiMultiFile()
  @UseInterceptors(FilesInterceptor('files'))
  async detectImage(@Body() body, @UploadedFiles() files: DetectImageDto[]) {
    let filesData = body.files || files || [];

    try {
      // const data = await Promise.all(
      //   filesData.map((file) => this.faceApi.detectImage(file)),
      // );

      const data = await this.faceApi.detectImage(filesData[0]);

      return { data };
    } catch (error) {
      console.log(
        '🚀 ~ file: face-api.controller.ts:38 ~ FaceApiController ~ detectImage ~ error:',
        error,
      );
      return ResponseMessage(error, 'BAD_REQUEST');
    }
  }

  @Post('/face-matcher')
  @HttpCode(200)
  async compareFace(@Body() faceMatcherDto: FaceMatcherDto) {
    const { descriptors, descriptorCompare } = faceMatcherDto;
    return this.faceApi.faceMatcher(descriptors, descriptorCompare);
  }
}
