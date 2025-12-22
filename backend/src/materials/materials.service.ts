import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { MaterialRepository } from "../repositories/material.repository";
import { FavoritRepository } from "../repositories/favorit.repository";
import { UserRepository } from "../repositories/user.repository";
import { CreateMaterialDto, UpdateMaterialDto } from "./dto/material.dto";
import {
  MaterialWithDetails,
  MaterialWithFavorites,
} from "../types/database.types";

@Injectable()
export class MaterialsService {
  constructor(
    private readonly materialRepository: MaterialRepository,
    private readonly favoritRepository: FavoritRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(
    createMaterialDto: CreateMaterialDto,
    userId: number,
  ): Promise<MaterialWithDetails> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Автоматически устанавливаем автора из имени пользователя
    const materialData = {
      ...createMaterialDto,
      author: user.name,
    };

    const material = await this.materialRepository.create(materialData);
    return this.materialRepository.findByIdWithDetails(
      material.id,
    ) as Promise<MaterialWithDetails>;
  }

  async findAll(userId?: number): Promise<MaterialWithFavorites[]> {
    const materials = await this.materialRepository.findAllWithDetails();

    if (userId) {
      const favorites = await this.favoritRepository.findByUser(userId);
      const favoriteMaterialIds = new Set(favorites.map((f) => f.materialId));

      return materials.map((material) => ({
        ...material,
        isFavorite: favoriteMaterialIds.has(material.id),
      }));
    }

    return materials.map((material) => ({
      ...material,
      isFavorite: false,
    }));
  }

  async findOne(id: number, userId?: number): Promise<MaterialWithFavorites> {
    const material = await this.materialRepository.findByIdWithDetails(id);
    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }

    let isFavorite = false;
    if (userId) {
      isFavorite = await this.favoritRepository.isFavorite(id, userId);
    }

    return {
      ...material,
      isFavorite,
    };
  }

  async update(
    id: number,
    updateMaterialDto: UpdateMaterialDto,
    userId: number,
    isAdmin: boolean,
  ): Promise<MaterialWithDetails> {
    const material = await this.materialRepository.findById(id);
    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Админ может редактировать любые материалы
    // Преподаватель может редактировать только свои материалы (проверка по author)
    if (!isAdmin && material.author !== user.name) {
      throw new ForbiddenException("You can only update your own materials");
    }

    await this.materialRepository.update(id, updateMaterialDto);
    return this.materialRepository.findByIdWithDetails(
      id,
    ) as Promise<MaterialWithDetails>;
  }

  async remove(id: number, userId: number, isAdmin: boolean): Promise<void> {
    const material = await this.materialRepository.findById(id);
    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Админ может удалять любые материалы
    // Преподаватель может удалять только свои материалы (проверка по author)
    if (!isAdmin && material.author !== user.name) {
      throw new ForbiddenException("You can only delete your own materials");
    }

    await this.materialRepository.delete(id);
  }

  async toggleFavorite(
    materialId: number,
    userId: number,
  ): Promise<{ isFavorite: boolean }> {
    const material = await this.materialRepository.findById(materialId);
    if (!material) {
      throw new NotFoundException(`Material with ID ${materialId} not found`);
    }

    const isFavorite = await this.favoritRepository.isFavorite(
      materialId,
      userId,
    );

    if (isFavorite) {
      await this.favoritRepository.delete(materialId, userId);
      return { isFavorite: false };
    } else {
      await this.favoritRepository.create({ materialId, userId });
      return { isFavorite: true };
    }
  }

  async findByCategory(
    categoryId: number,
    userId?: number,
  ): Promise<MaterialWithFavorites[]> {
    const materials = await this.materialRepository.findByCategory(categoryId);
    const materialsWithDetails = await Promise.all(
      materials.map((m) => this.materialRepository.findByIdWithDetails(m.id)),
    );

    if (userId) {
      const favorites = await this.favoritRepository.findByUser(userId);
      const favoriteMaterialIds = new Set(favorites.map((f) => f.materialId));

      return materialsWithDetails.map((material) => ({
        ...material!,
        isFavorite: favoriteMaterialIds.has(material!.id),
      }));
    }

    return materialsWithDetails.map((material) => ({
      ...material!,
      isFavorite: false,
    }));
  }

  async findByTheme(
    themeId: number,
    userId?: number,
  ): Promise<MaterialWithFavorites[]> {
    const materials = await this.materialRepository.findByTheme(themeId);
    const materialsWithDetails = await Promise.all(
      materials.map((m) => this.materialRepository.findByIdWithDetails(m.id)),
    );

    if (userId) {
      const favorites = await this.favoritRepository.findByUser(userId);
      const favoriteMaterialIds = new Set(favorites.map((f) => f.materialId));

      return materialsWithDetails.map((material) => ({
        ...material!,
        isFavorite: favoriteMaterialIds.has(material!.id),
      }));
    }

    return materialsWithDetails.map((material) => ({
      ...material!,
      isFavorite: false,
    }));
  }

  async findFavorites(userId: number): Promise<MaterialWithFavorites[]> {
    const favorites = await this.favoritRepository.findByUser(userId);
    const materialsWithDetails = await Promise.all(
      favorites.map((f) =>
        this.materialRepository.findByIdWithDetails(f.materialId),
      ),
    );

    return materialsWithDetails
      .filter((material) => material !== null)
      .map((material) => ({
        ...material,
        isFavorite: true,
      }));
  }
}
