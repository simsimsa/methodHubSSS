import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { ThemesService } from "./themes.service";
import { CreateThemeDto, UpdateThemeDto } from "./dto/theme.dto";
import { RequireAdmin } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";

@ApiTags("Themes")
@Controller("themes")
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Get()
  @ApiOperation({ summary: "Получить все темы" })
  @ApiResponse({ status: 200, description: "Список тем" })
  findAll() {
    return this.themesService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Получить тему по ID" })
  @ApiResponse({ status: 200, description: "Тема найдена" })
  @ApiResponse({ status: 404, description: "Тема не найдена" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.themesService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @RequireAdmin()
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Создать новую тему (только для админа)" })
  @ApiResponse({ status: 201, description: "Тема успешно создана" })
  @ApiResponse({ status: 403, description: "Доступ запрещен" })
  @ApiResponse({
    status: 409,
    description: "Тема с таким именем уже существует",
  })
  create(@Body() createThemeDto: CreateThemeDto) {
    return this.themesService.create(createThemeDto);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @RequireAdmin()
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Обновить тему (только для админа)" })
  @ApiResponse({ status: 200, description: "Тема обновлена" })
  @ApiResponse({ status: 403, description: "Доступ запрещен" })
  @ApiResponse({ status: 404, description: "Тема не найдена" })
  @ApiResponse({
    status: 409,
    description: "Тема с таким именем уже существует",
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateThemeDto: UpdateThemeDto,
  ) {
    return this.themesService.update(id, updateThemeDto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @RequireAdmin()
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Удалить тему (только для админа)" })
  @ApiResponse({ status: 200, description: "Тема удалена" })
  @ApiResponse({ status: 403, description: "Доступ запрещен" })
  @ApiResponse({ status: 404, description: "Тема не найдена" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.themesService.remove(id);
    return { message: "Theme deleted successfully" };
  }
}
