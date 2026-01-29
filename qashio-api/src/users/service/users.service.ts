import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repository/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }
  findOne(id: number) {
    return this.usersRepository.findOne(id);
  }
  findOneByUserName(userName: string) {
    return this.usersRepository.findOneByUserName(userName);
  }
}
