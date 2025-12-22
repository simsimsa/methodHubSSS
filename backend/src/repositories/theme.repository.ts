import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { DatabaseService } from '../database/database.service';
import { Theme } from '../types/database.types';

@Injectable()
export class ThemeRepository extends BaseRepository<Theme> {
  constructor(databaseService: DatabaseService) {
    super(databaseService);
  }

  protected getTableName(): string {
    return 'theme';
  }

  protected getPrimaryKey(): string {
    return 'id';
  }

  protected mapRowToEntity(row: Record<string, any>): Theme {
    return {
      id: Number(row.id),
      name: String(row.name),
      description: row.description ? String(row.description) : undefined,
    };
  }

  protected mapEntityToRow(entity: Partial<Theme>): Record<string, any> {
    const row: Record<string, any> = {};
    if (entity.name !== undefined) row.name = entity.name;
    if (entity.description !== undefined) row.description = entity.description;
    return row;
  }
}





