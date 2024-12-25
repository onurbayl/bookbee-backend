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
        .andWhere('review-like-dislike.likeDislike = :dislikeValue', { dislikeValue: -1 })
        .getCount();
    }

    async findByReviewAndUser(review_id: number, userId: number): Promise<ReviewLikeDislike | undefined> {
        return this.createQueryBuilder('review-like-dislike')
        .leftJoin('review-like-dislike.user', 'user')
        .leftJoin('review-like-dislike.review', 'review')
        .where('review.id = :i_review', {i_review: review_id})
        .andWhere('user.id = :i_user', { i_user: userId })
        .getOne();
    }
    
}