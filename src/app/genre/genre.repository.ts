import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Genre } from "./genre.entity";

@Injectable()
export class GenreRepository extends Repository<Genre> {
    constructor(private readonly  dataSource: DataSource) {
        super(Genre, dataSource.createEntityManager());
    }

    //Add custom repositories

}