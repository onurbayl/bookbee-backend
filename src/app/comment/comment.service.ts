import { Injectable } from "@nestjs/common";
import { CommentRepository } from "./comment.repository";
import { UserRepository } from "../user/user.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { Comment } from "./comment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentNotFoundException } from "./exceptions/comment-not-found-exception";

@Injectable()
export class CommentService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(CommentRepository)
        private readonly commentRepository: CommentRepository,

        private readonly userRepository: UserRepository
        
    ) {}

    async getCommentsByUser(userUId: string){

        const user = await this.userRepository.findByUId(userUId);
        if(user == null){
            UserNotFoundException.byUId();
        }

        let comments = await this.commentRepository.findByUser(user.id);

        if (comments != null){
            return comments;
        }
        else{
            CommentNotFoundException.byUser(user.id);
        }

    }

}