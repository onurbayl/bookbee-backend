import { Body, Controller, Param, UseGuards, Request, Get, Post, Delete } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('api/v1/comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Delete('delete-comment/:commentId')
    @UseGuards(AuthGuard)
    async DeleteComment(@Param('commentId') commentId: number, @Request() req){
        const uId = req.user.uid;
        const result = this.commentService.deleteComment(commentId);
        return result;
    }

}