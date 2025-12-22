import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty({
    description: "Название категории",
    example: "Математика (начальная)",
  })
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @ApiProperty({
    description: "Описание категории",
    example: "Математика для начальной школы",
    required: false,
  })
  @IsString({ message: "Description must be a string" })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "ID темы",
    example: 1,
  })
  @IsNumber({}, { message: "Theme must be a number" })
  @Min(1, { message: "Theme must be a positive number" })
  @IsNotEmpty({ message: "Theme is required" })
  theme: number;
}

export class UpdateCategoryDto {
  @ApiProperty({
    description: "Название категории",
    example: "Математика (начальная)",
    required: false,
  })
  @IsString({ message: "Name must be a string" })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: "Описание категории",
    example: "Математика для начальной школы",
    required: false,
  })
  @IsString({ message: "Description must be a string" })
  @IsOptional()
  description?: string;

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
