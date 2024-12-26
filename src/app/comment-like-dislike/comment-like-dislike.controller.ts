import { Body, Controller, Param, UseGuards, Request, Get, Post, Delete } from "@nestjs/common";
import { CommentLikeDislikeService } from "./comment-like-dislike.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('api/v1/comment-like')
export class CommentLikeDislikeController {
    constructor(private readonly commentLikeDislikeService: CommentLikeDislikeService) {}

    @Post('add-like/:commentId')
    @UseGuards(AuthGuard)
    async AddLike(@Param('commentId') commentId: number, @Request() req){
        const uId = req.user.uid;
        const result = this.commentLikeDislikeService.addLike(uId, commentId);
        return result;
    }

}