import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Review } from "./review.entity";

@Injectable()
export class ReviewRepository extends Repository<Review> {
    constructor(private readonly  dataSource: DataSource) {
        super(Review, dataSource.createEntityManager());
    }

    async findByBookAndUser(bookId: number, userId: number): Promise<Review | undefined> {
        return this.createQueryBuilder('review')
        .leftJoinAndSelect('review.user', 'user')
        .leftJoinAndSelect('review.book', 'book')
        .where('book.id = :i_book', { i_book: bookId })
        .andWhere('user.id = :i_user', { i_user: userId })
        .getOne();
    }

}