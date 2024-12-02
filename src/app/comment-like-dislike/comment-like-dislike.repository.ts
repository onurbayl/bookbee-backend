import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { CommentLikeDislike } from "./comment-like-dislike.entity";

@Injectable()
export class CommentLikeDislikeRepository extends Repository<CommentLikeDislike> {
    constructor(private readonly  dataSource: DataSource) {
        super(CommentLikeDislike, dataSource.createEntityManager());
    }

    //Add custom repositories

}