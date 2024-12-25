import { Body, Controller, Param, UseGuards, Request, Get, Post, Delete } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('api/v1/comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get('get-comments-by-user/')
    @UseGuards(AuthGuard)
    async GetCommentsByUser(@Request() req){
        const uId = req.user.uid;
        const result = this.commentService.getCommentsByUser(uId);
        return result;
    }

}