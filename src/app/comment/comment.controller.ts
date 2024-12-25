import { Body, Controller, Param, UseGuards, Request, Get, Post, Delete } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { AuthGuard } from "src/guards/auth.guard";


@Controller('api/v1/comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post('add-comment/:reviewId')
    @UseGuards(AuthGuard)
    async AddReview(@Param('reviewId') reviewId: number, @Request() req, @Body() body: { content: string }){
        const uId = req.user.uid;
        const {content} = body;
        const result = this.commentService.addComment(reviewId, uId, content);
        return result;
    }

}