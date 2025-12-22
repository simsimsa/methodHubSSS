import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { MaterialsService } from "./materials.service";
import { CreateMaterialDto, UpdateMaterialDto } from "./dto/material.dto";

@ApiTags("Materials")
@Controller("materials")
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Создать новый материал" })
  @ApiResponse({ status: 201, description: "Материал успешно создан" })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  async create(
    @Body() createMaterialDto: CreateMaterialDto,
    @Request() req: { user: any },
  ) {
    return this.materialsService.create(createMaterialDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: "Получить все материалы" })
  @ApiResponse({ status: 200, description: "Список материалов" })
  async findAll(@Request() req?: { user?: any }) {
    return this.materialsService.findAll(req?.user?.id);
  }

  @Get("category/:categoryId")
  @ApiOperation({ summary: "Получить материалы по категории" })
  @ApiResponse({ status: 200, description: "Список материалов категории" })
  async findByCategory(
    @Param("categoryId", ParseIntPipe) categoryId: number,
    @Request() req?: { user?: any },
  ) {
    return this.materialsService.findByCategory(categoryId, req?.user?.id);
  }

  @Get("theme/:themeId")
  @ApiOperation({ summary: "Получить материалы по теме" })
  @ApiResponse({ status: 200, description: "Список материалов темы" })
  async findByTheme(
    @Param("themeId", ParseIntPipe) themeId: number,
    @Request() req?: { user?: any },
  ) {
    return this.materialsService.findByTheme(themeId, req?.user?.id);
  }

  @Get("favorites")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Получить список избранных материалов" })
  @ApiResponse({ status: 200, description: "Список избранных материалов" })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  async findFavorites(@Request() req: { user: any }) {
    return this.materialsService.findFavorites(req.user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Получить материал по ID" })
  @ApiResponse({ status: 200, description: "Материал найден" })
  @ApiResponse({ status: 404, description: "Материал не найден" })
  async findOne(
    @Param("id", ParseIntPipe) id: number,
    @Request() req?: { user?: any },
  ) {
    return this.materialsService.findOne(id, req?.user?.id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary:
      "Обновить материал (преподаватель может редактировать только свои материалы, админ - любые)",
  })
  @ApiResponse({ status: 200, description: "Материал обновлен" })
  @ApiResponse({ status: 403, description: "Доступ запрещен" })
  @ApiResponse({ status: 404, description: "Материал не найден" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMaterialDto: UpdateMaterialDto,
    @Request() req: { user: any },
  ) {
    return this.materialsService.update(
      id,
      updateMaterialDto,
      req.user.id,
      req.user.isAdmin,
    );
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary:
      "Удалить материал (преподаватель может удалять только свои материалы, админ - любые)",
  })
  @ApiResponse({ status: 200, description: "Материал удален" })
  @ApiResponse({ status: 403, description: "Доступ запрещен" })
  @ApiResponse({ status: 404, description: "Материал не найден" })
  async remove(
    @Param("id", ParseIntPipe) id: number,
    @Request() req: { user: any },
  ) {
    await this.materialsService.remove(id, req.user.id, req.user.isAdmin);
    return { message: "Material deleted successfully" };
  }

  @Post(":id/favorite")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Добавить/удалить материал в избранное" })
  @ApiResponse({ status: 200, description: "Статус избранного изменен" })
  @ApiResponse({ status: 401, description: "Не авторизован" })
  @ApiResponse({ status: 404, description: "Материал не найден" })
  async toggleFavorite(
    @Param("id", ParseIntPipe) id: number,
    @Request() req: { user: any },
  ) {
    return this.materialsService.toggleFavorite(id, req.user.id);
  }
}
