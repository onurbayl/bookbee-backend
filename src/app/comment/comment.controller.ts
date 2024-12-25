import { Body, Controller, Param, UseGuards, Request, Get, Post, Delete } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('api/v1/comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get('get-last-ten-comments/:userId')
    async GetLastTenComments(@Request() req, @Param('userId') userId: number){
        const uId = req.user.uid;
        const result = this.commentService.getLastTenComments(userId);
        return result;
    }

}