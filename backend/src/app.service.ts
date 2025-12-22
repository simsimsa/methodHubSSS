import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { UserRepository } from './repositories/user.repository';
import { MaterialRepository } from './repositories/material.repository';

@Injectable()
export class AppService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userRepository: UserRepository,
    private readonly materialRepository: MaterialRepository,
  ) {}

  getHello(): string {
    return 'MethodHub API - Digital Library of Methodological Materials';
  }

  async getDatabaseInfo(): Promise<{
    isConnected: boolean;
    stats: any;
    userCount: number;
    materialCount: number;
  }> {
    const isConnected = await this.databaseService.isConnected();
    const stats = await this.databaseService.getStats();
    const userCount = await this.userRepository.count();
    const materialCount = await this.materialRepository.count();

    return {
      isConnected,
      stats,
      userCount,
      materialCount,
    };
  }
}





