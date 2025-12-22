import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateThemeDto {
  @ApiProperty({
    description: "Название темы",
    example: "Начальная школа",
  })
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @ApiProperty({
    description: "Описание темы",
    example: "Методические материалы для начальной школы (1-4 классы)",
    required: false,
  })
  @IsString({ message: "Description must be a string" })
  @IsOptional()
  description?: string;
}

export class UpdateThemeDto {
  @ApiProperty({
    description: "Название темы",
    example: "Начальная школа",
    required: false,
  })
  @IsString({ message: "Name must be a string" })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: "Описание темы",
    example: "Методические материалы для начальной школы (1-4 классы)",
    required: false,
  })
  @IsString({ message: "Description must be a string" })
  @IsOptional()
  description?: string;
}
