import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { LogService } from '../../logger/logger-service';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersRepository {
  private tableName = 'users';
  constructor(
    private readonly dbService: DatabaseService,
    private readonly logger: LogService,
  ) {}
  private get repo() {
    return this.dbService.getRepository(this.tableName);
  }

  async create(createUserDto: CreateUserDto) {
    const password = createUserDto.password;
    const hash = await bcrypt.hash(password, 10);
    const user = this.repo.create({
      ...createUserDto,
      password: hash,
    });
    const result = await this.repo.save(user);
    const findUser = await this.findOne(result.id);
    this.logger.log('Created user', JSON.stringify(findUser));
    return { status: 'success' };
  }

  async findOne(userId: number) {
    return await this.repo.findOneBy({ id: userId });
  }

   findOneByUserName(userName: string) {
    return this.repo.findOneBy({ username: userName });
  }
}
