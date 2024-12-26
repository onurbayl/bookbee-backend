import { Injectable } from "@nestjs/common";
import { GenreRepository } from "./genre.repository";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(GenreRepository)
        private readonly genreRepository: GenreRepository,
    ) {}

    async fetchAllGenres() {
        return await this.genreRepository.findAll();
    }

}