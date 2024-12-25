import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Review } from "./review.entity";

@Injectable()
export class ReviewRepository extends Repository<Review> {
    constructor(private readonly  dataSource: DataSource) {
        super(Review, dataSource.createEntityManager());
    }

    async GetTenLast(userId: number): Promise<Review[]> {
        return this.createQueryBuilder('comment')
        .leftJoin('comment.user', 'user')
        .where('user.id = :i_user', {i_user: userId})
        .orderBy('comment.dateCreated', 'DESC')
        .take(10)
        .getMany();
    }

}