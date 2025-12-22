import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { ThemeRepository } from './theme.repository';
import { CategoryRepository } from './category.repository';
import { MaterialRepository } from './material.repository';
import { FavoritRepository } from './favorit.repository';

@Module({
  providers: [
    UserRepository,
    ThemeRepository,
    CategoryRepository,
    MaterialRepository,
    FavoritRepository,
  ],
  exports: [
    UserRepository,
    ThemeRepository,
    CategoryRepository,
    MaterialRepository,
    FavoritRepository,
  ],
})
export class RepositoriesModule {}





