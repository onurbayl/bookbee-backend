import { Controller, Get, UseGuards, Post, Request, Patch, Delete, ForbiddenException, Param, NotFoundException, InternalServerErrorException, Next, Query, Body } from '@nestjs/common';
import { GenreService } from "./genre.service";

@Controller('api/v1/genre')
export class GenreController {
    constructor(private readonly genreService: GenreService) {}

    @Get('get-all-genres')
    async fetchAllGenres() {
        return await this.genreService.fetchAllGenres();
    }
    
}