import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMaterialDto {
  @ApiProperty({
    description: "Название материала",
    example: "План урока: Решение квадратных уравнений",
  })
  @IsString({ message: "Title must be a string" })
  @IsNotEmpty({ message: "Title is required" })
  title: string;

  @ApiProperty({
    description: "Описание материала",
    example: "Подробный план урока по алгебре для 8 класса",
    required: false,
  })
  @IsString({ message: "Description must be a string" })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Текст материала",
    example: "Содержание урока...",
    required: false,
  })
  @IsString({ message: "Text must be a string" })
  @IsOptional()
  text?: string;

  @ApiProperty({
    description:
      "Автор материала (автоматически устанавливается из имени пользователя)",
    example: "Иванова М.П.",
    required: false,
  })
  @IsString({ message: "Author must be a string" })
  @IsOptional()
  author?: string;

  @ApiProperty({
    description: "ID категории",
    example: 1,
  })
  @IsNumber({}, { message: "Category must be a number" })
  @Min(1, { message: "Category must be a positive number" })
  @IsNotEmpty({ message: "Category is required" })
  category: number;

  @ApiProperty({
    description: "ID темы",
    example: 1,
  })
  @IsNumber({}, { message: "Theme must be a number" })
  @Min(1, { message: "Theme must be a positive number" })
  @IsNotEmpty({ message: "Theme is required" })
  theme: number;
}

export class UpdateMaterialDto {
  @ApiProperty({
    description: "Название материала",
    example: "План урока: Решение квадратных уравнений",
    required: false,
  })
  @IsString({ message: "Title must be a string" })
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: "Описание материала",
    example: "Подробный план урока по алгебре для 8 класса",
    required: false,
  })
  @IsString({ message: "Description must be a string" })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Текст материала",
    example: "Содержание урока...",
    required: false,
  })
  @IsString({ message: "Text must be a string" })
  @IsOptional()
  text?: string;

  @ApiProperty({
    description: "Автор материала",
    example: "Иванова М.П.",
    required: false,
  })
  @IsString({ message: "Author must be a string" })
  @IsOptional()
  author?: string;

  @ApiProperty({
    description: "ID категории",
    example: 1,
    required: false,
  })
  @IsNumber({}, { message: "Category must be a number" })
  @Min(1, { message: "Category must be a positive number" })
  @IsOptional()
  category?: number;

  @ApiProperty({
    description: "ID темы",
    example: 1,
    required: false,
  })
  @IsNumber({}, { message: "Theme must be a number" })
  @Min(1, { message: "Theme must be a positive number" })
  @IsOptional()
  theme?: number;
}
