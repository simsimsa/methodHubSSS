import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { DatabaseService } from '../database/database.service';
import { Category, CategoryWithTheme } from '../types/database.types';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(databaseService: DatabaseService) {
    super(databaseService);
  }

  protected getTableName(): string {
    return 'category';
  }

  protected getPrimaryKey(): string {
    return 'id';
  }

  protected mapRowToEntity(row: Record<string, any>): Category {
    return {
      id: Number(row.id),
      name: String(row.name),
      description: row.description ? String(row.description) : undefined,
      theme: Number(row.theme),
    };
  }

  protected mapEntityToRow(entity: Partial<Category>): Record<string, any> {
    const row: Record<string, any> = {};
    if (entity.name !== undefined) row.name = entity.name;
    if (entity.description !== undefined) row.description = entity.description;
    if (entity.theme !== undefined) row.theme = entity.theme;
    return row;
  }

  async findByTheme(themeId: number): Promise<Category[]> {
    return this.findBy({ theme: themeId });
  }

  async findByIdWithTheme(id: number): Promise<CategoryWithTheme | null> {
    const query = `
      SELECT c.*, t.id as theme_id, t.name as theme_name, t.description as theme_description
      FROM category c
      JOIN theme t ON c.theme = t.id
      WHERE c.id = $1
    `;
    const result = await this.databaseService.query(query, [id]);

    if (result.rows.length === 0) return null;

    const row = result.rows[0] as Record<string, any>;
    return {
      id: Number(row.id),
      name: String(row.name),
      description: row.description ? String(row.description) : undefined,
      theme: Number(row.theme),
      themeDetails: {
        id: Number(row.theme_id),
        name: String(row.theme_name),
        description: row.theme_description ? String(row.theme_description) : undefined,
      },
    };
  }
}





