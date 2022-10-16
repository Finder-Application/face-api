import { ApiProperty } from '@nestjs/swagger';

export class DetectImageDto {
  files: {
    buffer: Uint8Array;
  };
}
