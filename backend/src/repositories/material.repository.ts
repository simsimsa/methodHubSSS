import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { DatabaseService } from '../database/database.service';
import { Material, MaterialWithDetails } from '../types/database.types';

@Injectable()
export class MaterialRepository extends BaseRepository<Material> {
  constructor(databaseService: DatabaseService) {
    super(databaseService);
  }

  protected getTableName(): string {
    return 'material';
  }

  protected getPrimaryKey(): string {
    return 'id';
  }

  protected mapRowToEntity(row: Record<string, any>): Material {
    return {
      id: Number(row.id),
      title: String(row.title),
      description: row.description ? String(row.description) : undefined,
      text: row.text ? String(row.text) : undefined,
      author: String(row.author),
      category: Number(row.category),
      theme: Number(row.theme),
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
    };
  }

  protected mapEntityToRow(entity: Partial<Material>): Record<string, any> {
    const row: Record<string, any> = {};
    if (entity.title !== undefined) row.title = entity.title;
    if (entity.description !== undefined) row.description = entity.description;
    if (entity.text !== undefined) row.text = entity.text;
    if (entity.author !== undefined) row.author = entity.author;
    if (entity.category !== undefined) row.category = entity.category;
    if (entity.theme !== undefined) row.theme = entity.theme;
    return row;
  }

  async findByCategory(categoryId: number): Promise<Material[]> {
    return this.findBy({ category: categoryId });
  }

  async findByTheme(themeId: number): Promise<Material[]> {
    return this.findBy({ theme: themeId });
  }

  async findByIdWithDetails(id: number): Promise<MaterialWithDetails | null> {
    const query = `
      SELECT 
        m.*,
        c.id as category_id, c.name as category_name, c.description as category_description, c.theme as category_theme,
        t.id as theme_id, t.name as theme_name, t.description as theme_description
      FROM material m
      JOIN category c ON m.category = c.id
      JOIN theme t ON m.theme = t.id
      WHERE m.id = $1
    `;
    const result = await this.databaseService.query(query, [id]);

    if (result.rows.length === 0) return null;

    const row = result.rows[0] as Record<string, any>;
    return {
      id: Number(row.id),
      title: String(row.title),
      description: row.description ? String(row.description) : undefined,
      text: row.text ? String(row.text) : undefined,
      author: String(row.author),
      category: Number(row.category),
      theme: Number(row.theme),
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
      categoryDetails: {
        id: Number(row.category_id),
        name: String(row.category_name),
        description: row.category_description ? String(row.category_description) : undefined,
        theme: Number(row.category_theme),
        themeDetails: {
          id: Number(row.theme_id),
          name: String(row.theme_name),
          description: row.theme_description ? String(row.theme_description) : undefined,
        },
      },
      themeDetails: {
        id: Number(row.theme_id),
        name: String(row.theme_name),
        description: row.theme_description ? String(row.theme_description) : undefined,
      },
    };
  }

  async findAllWithDetails(): Promise<MaterialWithDetails[]> {
    const query = `
      SELECT 
        m.*,
        c.id as category_id, c.name as category_name, c.description as category_description, c.theme as category_theme,
        t.id as theme_id, t.name as theme_name, t.description as theme_description
      FROM material m
      JOIN category c ON m.category = c.id
      JOIN theme t ON m.theme = t.id
      ORDER BY m.created_at DESC
    `;
    const result = await this.databaseService.query(query);

    return result.rows.map((row: Record<string, any>) => ({
      id: Number(row.id),
      title: String(row.title),
      description: row.description ? String(row.description) : undefined,
      text: row.text ? String(row.text) : undefined,
      author: String(row.author),
      category: Number(row.category),
      theme: Number(row.theme),
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
      categoryDetails: {
        id: Number(row.category_id),
        name: String(row.category_name),
        description: row.category_description ? String(row.category_description) : undefined,
        theme: Number(row.category_theme),
        themeDetails: {
          id: Number(row.theme_id),
          name: String(row.theme_name),
          description: row.theme_description ? String(row.theme_description) : undefined,
        },
      },
      themeDetails: {
        id: Number(row.theme_id),
        name: String(row.theme_name),
        description: row.theme_description ? String(row.theme_description) : undefined,
      },
    }));
  }
}





