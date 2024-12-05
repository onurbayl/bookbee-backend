import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentLikeDislikeRepository } from "./comment-like-dislike.repository";

@Injectable()
export class CommentLikeDislikeService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(CommentLikeDislikeRepository)
        private readonly commentLikeDislikeRepository: CommentLikeDislikeRepository,
    ) {}

    //Add service methods

}