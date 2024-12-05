import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReviewLikeDislikeRepository } from "./review-like-dislike.repository";

@Injectable()
export class ReviewLikeDislikeService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(ReviewLikeDislikeRepository)
        private readonly reviewLikeDislikeRepository: ReviewLikeDislikeRepository,
    ) {}

    //Add service methods

}