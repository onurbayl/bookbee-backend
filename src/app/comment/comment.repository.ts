import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Comment } from "./comment.entity";

@Injectable()
export class CommentRepository extends Repository<Comment> {
    constructor(private readonly  dataSource: DataSource) {
        super(Comment, dataSource.createEntityManager());
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

}