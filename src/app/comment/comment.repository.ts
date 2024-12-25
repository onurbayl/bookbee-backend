import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Comment } from "./comment.entity";

@Injectable()
export class CommentRepository extends Repository<Comment> {
    constructor(private readonly  dataSource: DataSource) {
        super(Comment, dataSource.createEntityManager());
    }

    async findById(commentId: number): Promise<Comment | undefined> {
        return this.createQueryBuilder('comment')
        .leftJoin('comment.user', 'user')
        .leftJoin('comment.review', 'review')
        .where('comment.id = :i_comment', {i_comment: commentId})
        .getOne();
    }

    async GetTenLast(userId: number): Promise<Comment[]> {
        return this.createQueryBuilder('comment')
        .leftJoin('comment.user', 'user')
        .leftJoin('comment.review', 'review')
        .where('user.id = :i_user', {i_user: userId})
        .orderBy('comment.dateCreated', 'DESC')
        .take(10)
        .getMany();
    }
    
    async findByReview(review_id: number): Promise<Comment[]> {
        return this.createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoin('comment.review', 'review')
        .where('review.id = :i_review', {i_review: review_id})
        .getMany();
    }
    
    async findByUser(userId: number): Promise<Comment[]> {
        return this.createQueryBuilder('comment')
        .leftJoin('comment.user', 'user')
        .leftJoin('comment.review', 'review')
        .addSelect('review.id')
        .where('user.id = :i_user', {i_user: userId})
        .getMany();
    }

}