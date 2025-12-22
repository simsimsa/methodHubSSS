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
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
import { RequireAdmin } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: "Получить все категории" })
  @ApiResponse({ status: 200, description: "Список категорий" })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get("theme/:themeId")
  @ApiOperation({ summary: "Получить категории по теме" })
  @ApiResponse({ status: 200, description: "Список категорий темы" })
  findByTheme(@Param("themeId", ParseIntPipe) themeId: number) {
    return this.categoriesService.findByTheme(themeId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Получить категорию по ID" })
  @ApiResponse({ status: 200, description: "Категория найдена" })
  @ApiResponse({ status: 404, description: "Категория не найдена" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @RequireAdmin()
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Создать новую категорию (только для админа)" })
  @ApiResponse({ status: 201, description: "Категория успешно создана" })
  @ApiResponse({ status: 403, description: "Доступ запрещен" })
  @ApiResponse({ status: 404, description: "Тема не найдена" })
  @ApiResponse({
    status: 409,
    description: "Категория с таким именем уже существует",
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @RequireAdmin()
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Обновить категорию (только для админа)" })
  @ApiResponse({ status: 200, description: "Категория обновлена" })
  @ApiResponse({ status: 403, description: "Доступ запрещен" })
  @ApiResponse({ status: 404, description: "Категория или тема не найдена" })
  @ApiResponse({
    status: 409,
    description: "Категория с таким именем уже существует",
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @RequireAdmin()
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Удалить категорию (только для админа)" })
  @ApiResponse({ status: 200, description: "Категория удалена" })
  @ApiResponse({ status: 403, description: "Доступ запрещен" })
  @ApiResponse({ status: 404, description: "Категория не найдена" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.categoriesService.remove(id);
    return { message: "Category deleted successfully" };
  }
}
