import { Injectable } from '@nestjs/common';
import { ResponseMessage } from 'utils';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor() {}

  async getAllUsers(): Promise<User[]> {
    // TODO: using ORM (TypeORM, Sequelize ... ), we need to get all the users from the database
    const dummyData: User[] = [
      {
        uid: new Date().getTime().toString(),
        firstName: 'John',
        lastName: 'Module',
      },
      {
        uid: new Date().getTime().toString(),
        firstName: 'Alex',
        lastName: 'Alex said',
      },
    ];
    return dummyData;
  }

  async getAllUsersError() {
    // Response Exception
    return ResponseMessage('Get all users failed', 'FORBIDDEN');
  }
}
