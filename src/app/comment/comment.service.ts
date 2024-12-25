import { Injectable } from "@nestjs/common";
import { CommentRepository } from "./comment.repository";
import { ReviewRepository } from "../review/review.repository";
import { UserRepository } from "../user/user.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { ReviewNotFoundException } from "../review/exceptions/review-not-found-exception";
import { Comment } from "./comment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentNotFoundException } from "./exceptions/comment-not-found-exception";


@Injectable()
export class CommentService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(CommentRepository)
        private readonly commentRepository: CommentRepository,

        @InjectRepository(ReviewRepository)
        private readonly reviewRepository: ReviewRepository
    ) {}

    async getCommentsByReview(reviewId: number){

        const review = await this.reviewRepository.findById(reviewId);
        if(review == null){
            ReviewNotFoundException.byId(reviewId);
        }

        let comments = await this.commentRepository.findByReview(reviewId);

        if (comments != null){
            return comments;
        }
        else{
            CommentNotFoundException.byReview(reviewId);
        }

    }

}