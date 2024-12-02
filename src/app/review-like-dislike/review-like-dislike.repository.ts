import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ReviewLikeDislike } from "./review-like-dislike.entity";

@Injectable()
export class ReviewLikeDislikeRepository extends Repository<ReviewLikeDislike> {
    constructor(private readonly  dataSource: DataSource) {
        super(ReviewLikeDislike, dataSource.createEntityManager());
    }

    //Add custom repositories

}