import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Favorit } from '../types/database.types';

@Injectable()
export class FavoritRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(favorit: Favorit): Promise<Favorit> {
    const query = `
      INSERT INTO favorit (material_id, user_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await this.databaseService.query(query, [favorit.materialId, favorit.userId]);
    const row = result.rows[0] as Record<string, any>;
    return {
      materialId: Number(row.material_id),
      userId: Number(row.user_id),
    };
  }

  async delete(materialId: number, userId: number): Promise<boolean> {
    const query = `
      DELETE FROM favorit 
      WHERE material_id = $1 AND user_id = $2
    `;
    const result = await this.databaseService.query(query, [materialId, userId]);
    return result.rowCount > 0;
  }

  async findByUser(userId: number): Promise<Favorit[]> {
    const query = `
      SELECT * FROM favorit
      WHERE user_id = $1
    `;
    const result = await this.databaseService.query(query, [userId]);
    return result.rows.map((row: Record<string, any>) => ({
      materialId: Number(row.material_id),
      userId: Number(row.user_id),
    }));
  }

  async findByMaterial(materialId: number): Promise<Favorit[]> {
    const query = `
      SELECT * FROM favorit
      WHERE material_id = $1
    `;
    const result = await this.databaseService.query(query, [materialId]);
    return result.rows.map((row: Record<string, any>) => ({
      materialId: Number(row.material_id),
      userId: Number(row.user_id),
    }));
  }

  async isFavorite(materialId: number, userId: number): Promise<boolean> {
    const query = `
      SELECT * FROM favorit
      WHERE material_id = $1 AND user_id = $2
      LIMIT 1
    `;
    const result = await this.databaseService.query(query, [materialId, userId]);
    return result.rows.length > 0;
  }
}





