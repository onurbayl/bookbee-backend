import { Controller } from "@nestjs/common";
import { GenreService } from "./genre.service";

@Controller('api/v1/genre')
export class GenreController {
    constructor(private readonly bookService: GenreService) {}

    //Add api endpoints
    
}