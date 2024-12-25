import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Review } from "./review.entity";

@Injectable()
export class ReviewRepository extends Repository<Review> {
    constructor(private readonly  dataSource: DataSource) {
        super(Review, dataSource.createEntityManager());
    }

    async findByBook(bookId: number): Promise<Review[]> {
        return this.createQueryBuilder('review')
        .leftJoin('review.user', 'user')
        .leftJoin('review.book', 'book')
        .where('book.id = :i_book', {i_book: bookId})
        .getMany();
    }

}