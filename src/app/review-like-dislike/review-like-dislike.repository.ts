import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ReviewLikeDislike } from "./review-like-dislike.entity";

@Injectable()
export class ReviewLikeDislikeRepository extends Repository<ReviewLikeDislike> {
    constructor(private readonly  dataSource: DataSource) {
        super(ReviewLikeDislike, dataSource.createEntityManager());
    }

    async getLikeCount(review_id: number): Promise<number> {
        return this.createQueryBuilder('review-like-dislike')
        .where('review-like-dislike.review_id = :review_id', { review_id })
        .andWhere('review-like-dislike.likeDislike = :likeValue', { likeValue: 1 })
        .getCount();
    }

    async getDislikeCount(review_id: number): Promise<number> {
        return this.createQueryBuilder('review-like-dislike')
        .where('review-like-dislike.review_id = :review_id', { review_id })
        .andWhere('review-like-dislike.likeDislike = :likeValue', { likeValue: 1 })
        .getCount();
    }

}