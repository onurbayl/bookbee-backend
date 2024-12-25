import { Injectable } from "@nestjs/common";
import { CommentRepository } from "./comment.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "./comment.entity";
import { CommentNotFoundException } from "./exceptions/comment-not-found-exception";

@Injectable()
export class CommentService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(CommentRepository)
        private readonly commentRepository: CommentRepository,
    ) {}

    async deleteComment(commentId: number){

        let comment = await this.commentRepository.findById(commentId);

        if(comment == null){
            CommentNotFoundException.byId(commentId);
        }

        await this.commentRepository.delete(comment);

        return { message: 'This comment with ID ' + commentId + ' was removed.' }
        
    }

}