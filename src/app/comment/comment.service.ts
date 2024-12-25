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

        private readonly userRepository: UserRepository,

        private readonly reviewRepository: ReviewRepository
    ) {}

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

}