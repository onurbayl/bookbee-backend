import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Comment } from "./comment.entity";

@Injectable()
export class CommentRepository extends Repository<Comment> {
    constructor(private readonly  dataSource: DataSource) {
        super(Comment, dataSource.createEntityManager());
    }
    
    async findByReview(review_id: number): Promise<Comment[]> {
        return this.createQueryBuilder('comment')
        .leftJoin('comment.user', 'user')
        .leftJoin('comment.review', 'review')
        .where('review.id = :i_review', {i_review: review_id})
        .getMany();
    }

}