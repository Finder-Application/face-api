import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Query,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/createUser.dto';
import { GetUserDto } from './dto/GetUser.dto';
import { UsersService } from './users.service';
import { ApiQuery } from '@nestjs/swagger';

@ApiTags('Apis Users ')
@Controller('users')
export class UserController {
  constructor(private userService: UsersService) {}

  @Get('')
  async getAllUser() {
    return this.userService.getAllUsers();
  }
  @Post('')
  async createUser(@Body() CreateUserDto: CreateUserDto) {
    return CreateUserDto;
  }

  @Get('error')
  async getAllUsersError() {
    return this.userService.getAllUsersError();
  }

  @Get('detail')
  async getUserDetail(@Query() GetUserDto: GetUserDto) {
    return {
      message: 'Get user details',
      GetUserDto,
    };
  }

  @Delete()
  async deleteUser() {
    return {
      message: 'Delete user',
    };
  }
}
