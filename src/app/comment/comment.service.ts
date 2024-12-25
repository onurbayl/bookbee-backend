import { Injectable } from "@nestjs/common";
import { CommentRepository } from "./comment.repository";
import { ReviewRepository } from "../review/review.repository";
import { UserRepository } from "../user/user.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { ReviewNotFoundException } from "../review/exceptions/review-not-found.exception";
import { Comment } from "./comment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentNotFoundException } from "./exceptions/comment-not-found-exception";
import { UserUnauthorizedException } from "../user/exceptions/user-unauthorized.exception";
import { CommentWithLikeDislikeDto } from "./dtos/comment-with-like-dislike-dto";
import { CommentLikeDislikeRepository } from "../comment-like-dislike/comment-like-dislike.repository";

@Injectable()
export class CommentService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(CommentRepository)
        private readonly commentRepository: CommentRepository,

        @InjectRepository(ReviewRepository)
        private readonly reviewRepository: ReviewRepository,
  
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,

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

    async getCommentsByUser(userUId: string){

        const user = await this.userRepository.findByUId(userUId);
        if(user == null){
            UserNotFoundException.byUId();
        }

        let comments = await this.commentRepository.findByUser(user.id);
        
        if (!comments) {
            CommentNotFoundException.byUser(user.id);
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

    async getLastTenComments(userId: number){

        const user = await this.userRepository.findById(userId);
        if(user == null){
            UserNotFoundException.byId(userId);
        }

        let comments = await this.commentRepository.GetTenLast(user.id);

        if (!comments){
            CommentNotFoundException.byUser(user.id);
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
  
    async addComment(reviewId: number, userUId: string, content: string){

        const user = await this.userRepository.findByUId(userUId);
        if(user == null){
            UserNotFoundException.byUId();
        }

        const review = await this.reviewRepository.findById(reviewId);
        if(review == null){
            ReviewNotFoundException.byId(reviewId);
        }

        if(content == null){
            CommentNotFoundException.noContent();
        }

        const comment = new Comment();
        comment.user = user;
        comment.review = review;
        comment.content = content;
        comment.dateCreated = new Date();

        return await this.commentRepository.save(comment);
    }

    async deleteComment(uId: string, commentId: number, isAdmin: boolean){

        let comment = await this.commentRepository.findById(commentId);

        if(comment == null){
            CommentNotFoundException.byId(commentId);
        }
        
        if(uId !== comment.user.uid && !isAdmin){
            UserUnauthorizedException.byNotPermitted();
        }

        await this.commentRepository.delete(comment);

        return { message: 'This comment with ID ' + commentId + ' was removed.' }
    }

}