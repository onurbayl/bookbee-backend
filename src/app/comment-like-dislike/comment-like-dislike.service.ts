import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentLikeDislikeRepository } from "./comment-like-dislike.repository";
import { UserRepository } from "../user/user.repository";
import { CommentRepository } from "../comment/comment.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { CommentNotFoundException } from "../comment/exceptions/comment-not-found.exception";
import { CommentLikeDislike } from "./comment-like-dislike.entity";

@Injectable()
export class CommentLikeDislikeService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(CommentLikeDislikeRepository)
        private readonly commentLikeDislikeRepository: CommentLikeDislikeRepository,

        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,

        @InjectRepository(CommentRepository)
        private readonly commentRepository: CommentRepository
    ) {}

    async addDislike(userUId: string, commentId: number){

        const user = await this.userRepository.findByUId(userUId);
        if(user == null){
            UserNotFoundException.byUId();
        }
        
        const comment = await this.commentRepository.findById(commentId);
        if(comment == null){
            CommentNotFoundException.byId(commentId);
        }

        let existingRecord = await this.commentLikeDislikeRepository.findByReviewAndUser(commentId, user.id);

        if(existingRecord && existingRecord.likeDislike == -1){
            await this.commentLikeDislikeRepository.delete(existingRecord);
            return { message: 'A record has been deleted as it was -1.' }
        }
        
        if(existingRecord && existingRecord.likeDislike == 1){
            existingRecord.likeDislike = -1;
            await this.commentLikeDislikeRepository.save(existingRecord);
            return { message: 'A record has been changed as it was 1.' };
        }

        if(!existingRecord){
            existingRecord = new CommentLikeDislike;
            existingRecord.user = user;
            existingRecord.comment = comment;
            existingRecord.dateCreated = new Date();
            existingRecord.likeDislike = -1;
            await this.commentLikeDislikeRepository.save(existingRecord);
            return { message: 'A record has been created as there was none.' };
        }

    }

}