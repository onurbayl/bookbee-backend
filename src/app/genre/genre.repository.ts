import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Genre } from "./genre.entity";

@Injectable()
export class GenreRepository extends Repository<Genre> {
    constructor(private readonly  dataSource: DataSource) {
        super(Genre, dataSource.createEntityManager());
    }

    async findGenre(id: number): Promise<Genre | undefined> { 
        return await this.createQueryBuilder('genre')
        .where( 'genre.id = :id', { id: id} )
        .getOne();
    }

    async findAll(): Promise<Genre[] | undefined> {
            return await this.createQueryBuilder('genre')
            .getMany();
    }

}