import { Injectable } from "@nestjs/common";
import { CommentRepository } from "./comment.repository";
import { ReviewRepository } from "../review/review.repository";
import { UserRepository } from "../user/user.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { ReviewNotFoundException } from "../review/exceptions/review-not-found-exception";
import { Comment } from "./comment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentNotFoundException } from "./exceptions/comment-not-found-exception";
import { CommentWithLikeDislikeDto } from "./dtos/comment-with-like-dislike-dto";
import { CommentLikeDislikeRepository } from "../comment-like-dislike/comment-like-dislike.repository";


@Injectable()
export class CommentService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(CommentRepository)
        private readonly commentRepository: CommentRepository,

        @InjectRepository(ReviewRepository)
        private readonly reviewRepository: ReviewRepository,

        @InjectRepository(CommentLikeDislikeRepository)
        private readonly commentLikeDislikeRepository: CommentLikeDislikeRepository
    ) {}

    async getCommentsByReview(reviewId: number){

        const review = await this.reviewRepository.findById(reviewId);
        if(review == null){
            ReviewNotFoundException.byId(reviewId);
        }

        let comments = await this.commentRepository.findByReview(reviewId);
        
        if (!comments) {
            CommentNotFoundException.byReview(reviewId);
        }

        let commentsDto: CommentWithLikeDislikeDto[] = [];

        for (const comment of comments){

            let commentDto = new CommentWithLikeDislikeDto();
            commentDto.id = comment.id;
            commentDto.user = comment.user;
            commentDto.review = comment.review;
            commentDto.content = comment.content;
            commentDto.likeCount = await this.commentLikeDislikeRepository.getLikeCount(comment.id);
            commentDto.dislikeCount = await this.commentLikeDislikeRepository.getDislikeCount(comment.id);

            commentsDto.push(commentDto);
        }
        
        return commentsDto;

    }

}