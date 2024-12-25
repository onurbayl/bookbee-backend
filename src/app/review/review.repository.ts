import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Review } from "./review.entity";

@Injectable()
export class ReviewRepository extends Repository<Review> {
    constructor(private readonly  dataSource: DataSource) {
        super(Review, dataSource.createEntityManager());
    }

    async findByUser(userId: number): Promise<Review[]> {
        return this.createQueryBuilder('review')
        .leftJoin('review.user', 'user')
        .leftJoin('review.book', 'book')
        .where('user.id = :i_user', {i_user: userId})
        .getMany();
    }

}