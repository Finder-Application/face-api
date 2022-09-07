import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
export class GetUserDto {
  @ApiProperty({
    type: String,
    example: 'xxxx',
  })
  @IsString()
  @IsNotEmpty()
  uid: string;
}
