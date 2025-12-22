import { IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({
    description: "Является ли пользователь администратором",
    example: false,
    required: false,
  })
  @IsBoolean({ message: "isAdmin must be a boolean" })
  @IsOptional()
  isAdmin?: boolean;

  @ApiProperty({
    description: "Заблокирован ли пользователь",
    example: false,
    required: false,
  })
  @IsBoolean({ message: "isBanned must be a boolean" })
  @IsOptional()
  isBanned?: boolean;
}
