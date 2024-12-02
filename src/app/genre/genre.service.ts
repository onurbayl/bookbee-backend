import { Injectable } from "@nestjs/common";
import { GenreRepository } from "./genre.repository";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class GenreService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(GenreRepository)
        private readonly genreRepository: GenreRepository,
    ) {}

    //Add service methods

}