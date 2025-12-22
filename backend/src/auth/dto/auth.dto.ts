import { IsEmail, IsString, MinLength, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({
    description: "Email адрес пользователя",
    example: "teacher@example.com",
    format: "email",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @ApiProperty({
    description: "Пароль пользователя",
    example: "password123",
    minLength: 6,
  })
  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @IsNotEmpty({ message: "Password is required" })
  password: string;

  @ApiProperty({
    description: "Имя пользователя",
    example: "Иванова Мария Петровна",
  })
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name: string;
}

export class LoginDto {
  @ApiProperty({
    description: "Email адрес пользователя",
    example: "teacher@example.com",
    format: "email",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @ApiProperty({
    description: "Пароль пользователя",
    example: "password123",
  })
  @IsString({ message: "Password must be a string" })
  @IsNotEmpty({ message: "Password is required" })
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: "JWT токен доступа",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  access_token: string;

  @ApiProperty({
    description: "Информация о пользователе",
    type: "object",
    properties: {
      id: { type: "number", example: 1 },
      email: { type: "string", example: "teacher@example.com" },
      name: { type: "string", example: "Иванова Мария Петровна" },
      isAdmin: { type: "boolean", example: false },
    },
  })
  user: {
    id: number;
    email: string;
    name: string;
    isAdmin: boolean;
  };
}


