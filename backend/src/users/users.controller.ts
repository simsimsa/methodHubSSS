import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/user.dto";
import { RequireAdmin } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";

@ApiTags("Users")
@Controller("users")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@RequireAdmin()
@ApiBearerAuth("JWT-auth")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: "Получить список всех пользователей (только для админа)",
  })
  @ApiResponse({ status: 200, description: "Список пользователей" })
  @ApiResponse({ status: 403, description: "Доступ запрещен" })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Получить пользователя по ID (только для админа)" })
  @ApiResponse({ status: 200, description: "Пользователь найден" })
  @ApiResponse({ status: 403, description: "Доступ запрещен" })
  @ApiResponse({ status: 404, description: "Пользователь не найден" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({
    summary:
      "Обновить пользователя (изменить роль или заблокировать) (только для админа)",
  })
  @ApiResponse({ status: 200, description: "Пользователь обновлен" })
  @ApiResponse({ status: 403, description: "Доступ запрещен" })
  @ApiResponse({ status: 404, description: "Пользователь не найден" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }
}
