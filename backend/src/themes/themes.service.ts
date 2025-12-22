import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { ThemeRepository } from "../repositories/theme.repository";
import { Theme } from "../types/database.types";
import { CreateThemeDto, UpdateThemeDto } from "./dto/theme.dto";

@Injectable()
export class ThemesService {
  constructor(private readonly themeRepository: ThemeRepository) {}

  async findAll(): Promise<Theme[]> {
    return this.themeRepository.findAll();
  }

  async findOne(id: number): Promise<Theme> {
    const theme = await this.themeRepository.findById(id);
    if (!theme) {
      throw new NotFoundException(`Theme with ID ${id} not found`);
    }
    return theme;
  }

  async create(createThemeDto: CreateThemeDto): Promise<Theme> {
    const existingTheme = await this.themeRepository.findOneBy({
      name: createThemeDto.name,
    });
    if (existingTheme) {
      throw new ConflictException(
        `Theme with name "${createThemeDto.name}" already exists`,
      );
    }
    return this.themeRepository.create(createThemeDto);
  }

  async update(id: number, updateThemeDto: UpdateThemeDto): Promise<Theme> {
    const theme = await this.themeRepository.findById(id);
    if (!theme) {
      throw new NotFoundException(`Theme with ID ${id} not found`);
    }

    if (updateThemeDto.name) {
      const existingTheme = await this.themeRepository.findOneBy({
        name: updateThemeDto.name,
      });
      if (existingTheme && existingTheme.id !== id) {
        throw new ConflictException(
          `Theme with name "${updateThemeDto.name}" already exists`,
        );
      }
    }

    const updated = await this.themeRepository.update(id, updateThemeDto);
    if (!updated) {
      throw new NotFoundException(`Theme with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    const theme = await this.themeRepository.findById(id);
    if (!theme) {
      throw new NotFoundException(`Theme with ID ${id} not found`);
    }

    const deleted = await this.themeRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Theme with ID ${id} not found`);
    }
  }
}
