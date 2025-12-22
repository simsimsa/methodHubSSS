import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { RepositoriesModule } from "./repositories/repositories.module";
import { AuthModule } from "./auth/auth.module";
import { MaterialsModule } from "./materials/materials.module";
import { ThemesModule } from "./themes/themes.module";
import { CategoriesModule } from "./categories/categories.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    DatabaseModule,
    RepositoriesModule,
    AuthModule,
    MaterialsModule,
    ThemesModule,
    CategoriesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
