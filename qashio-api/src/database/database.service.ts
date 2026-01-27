import { Injectable } from '@nestjs/common';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private readonly dataSource: DataSource) {}

  getRepository<Entity extends ObjectLiteral>(entity: EntityTarget<Entity>) {
    return this.dataSource.getRepository(entity);
  }
}
