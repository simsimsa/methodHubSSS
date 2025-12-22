import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { CategoryRepository } from "../repositories/category.repository";
import { ThemeRepository } from "../repositories/theme.repository";
import { Category, CategoryWithTheme } from "../types/database.types";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly themeRepository: ThemeRepository,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async findOne(id: number): Promise<CategoryWithTheme> {
    const category = await this.categoryRepository.findByIdWithTheme(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async findByTheme(themeId: number): Promise<Category[]> {
    return this.categoryRepository.findByTheme(themeId);
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const theme = await this.themeRepository.findById(createCategoryDto.theme);
    if (!theme) {
      throw new NotFoundException(
        `Theme with ID ${createCategoryDto.theme} not found`,
      );
    }

    const existingCategory = await this.categoryRepository.findOneBy({
      name: createCategoryDto.name,
    });
    if (existingCategory) {
      throw new ConflictException(
        `Category with name "${createCategoryDto.name}" already exists`,
      );
    }

    return this.categoryRepository.create(createCategoryDto);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (updateCategoryDto.theme) {
      const theme = await this.themeRepository.findById(
        updateCategoryDto.theme,
      );
      if (!theme) {
        throw new NotFoundException(
          `Theme with ID ${updateCategoryDto.theme} not found`,
        );
      }
    }

    if (updateCategoryDto.name) {
      const existingCategory = await this.categoryRepository.findOneBy({
        name: updateCategoryDto.name,
      });
      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException(
          `Category with name "${updateCategoryDto.name}" already exists`,
        );
      }
    }

    const updated = await this.categoryRepository.update(id, updateCategoryDto);
    if (!updated) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const deleted = await this.categoryRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
