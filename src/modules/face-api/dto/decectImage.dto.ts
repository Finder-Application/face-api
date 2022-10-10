import { ApiProperty } from '@nestjs/swagger';

export class DetectImageDto {
  @ApiProperty({
    example: ['base64, base64'],
  })
  files: string[];
}
