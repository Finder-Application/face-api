import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString, IsDefined } from 'class-validator';
export class CreateUserDto {
  @ApiProperty({
    example: 'Alex sandbox',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Alex sandbox',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Date of birth',
    required: true,
  })
  @IsDateString()
  createdAt: Date;
}
