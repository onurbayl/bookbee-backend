import { Injectable } from "@nestjs/common";
import { CommentRepository } from "./comment.repository";
import { UserRepository } from "../user/user.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { Comment } from "./comment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentNotFoundException } from "./exceptions/comment-not-found-exception";
import { CommentLikeDislikeRepository } from "../comment-like-dislike/comment-like-dislike.repository";
import { CommentWithLikeDislikeDto } from "./dtos/comment-with-like-dislike-dto";

@Injectable()
export class CommentService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(CommentRepository)
        private readonly commentRepository: CommentRepository,

        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,

        @InjectRepository(CommentLikeDislikeRepository)
        private readonly commentLikeDislikeRepository: CommentLikeDislikeRepository
    ) {}

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

}