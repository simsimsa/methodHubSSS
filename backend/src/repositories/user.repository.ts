import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { DatabaseService } from '../database/database.service';
import { User } from '../types/database.types';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(databaseService: DatabaseService) {
    super(databaseService);
  }

  protected getTableName(): string {
    return '"user"';
  }

  protected getPrimaryKey(): string {
    return 'id';
  }

  protected mapRowToEntity(row: Record<string, any>): User {
    return {
      id: Number(row.id),
      name: String(row.name),
      passwordHash: String(row.password_hash),
      email: String(row.email),
      isAdmin: Boolean(row.is_admin),
      isBanned: Boolean(row.is_banned),
    };
  }

  protected mapEntityToRow(entity: Partial<User>): Record<string, any> {
    const row: Record<string, any> = {};
    if (entity.name !== undefined) row.name = entity.name;
    if (entity.passwordHash !== undefined) row.password_hash = entity.passwordHash;
    if (entity.email !== undefined) row.email = entity.email;
    if (entity.isAdmin !== undefined) row.is_admin = entity.isAdmin;
    if (entity.isBanned !== undefined) row.is_banned = entity.isBanned;
    return row;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOneBy({ email });
  }
}





