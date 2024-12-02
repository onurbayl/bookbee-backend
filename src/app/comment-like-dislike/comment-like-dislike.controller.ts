import { Controller } from "@nestjs/common";
import { CommentLikeDislikeService } from "./comment-like-dislike.service";

@Controller('api/v1/comment-like')
export class CommentLikeDislikeController {
    constructor(private readonly commentLikeDislikeService: CommentLikeDislikeService) {}

    //Add api endpoints

}