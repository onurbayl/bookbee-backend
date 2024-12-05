import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Genre } from "./genre.entity";
import { GenreController } from "./genre.controller";
import { GenreService } from "./genre.service";
import { GenreRepository } from "./genre.repository";

@Module({
    imports: [TypeOrmModule.forFeature([Genre])],
    controllers: [GenreController],
    providers: [GenreService, GenreRepository],
    exports: [GenreRepository],
  })
  export class GenreModule {}