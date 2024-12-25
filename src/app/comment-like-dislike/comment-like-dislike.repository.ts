import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { CommentLikeDislike } from "./comment-like-dislike.entity";

@Injectable()
export class CommentLikeDislikeRepository extends Repository<CommentLikeDislike> {
    constructor(private readonly  dataSource: DataSource) {
        super(CommentLikeDislike, dataSource.createEntityManager());
    }

    async getLikeCount(comment_id: number): Promise<number> {
        return this.createQueryBuilder('comment-like-dislike')
        .where('comment-like-dislike.comment_id = :comment_id', { comment_id })
        .andWhere('comment-like-dislike.likeDislike = :likeValue', { likeValue: 1 })
        .getCount();
    }

    async getDislikeCount(comment_id: number): Promise<number> {
        return this.createQueryBuilder('comment-like-dislike')
        .where('comment-like-dislike.comment_id = :comment_id', { comment_id })
        .andWhere('comment-like-dislike.likeDislike = :dislikeValue', { dislikeValue: -1 })
        .getCount();
    }

}