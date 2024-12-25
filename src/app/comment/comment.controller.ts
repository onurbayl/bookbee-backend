import { Body, Controller, Param, UseGuards, Request, Get, Post, Delete } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { AuthGuard } from "src/guards/auth.guard";
import { CommentWithLikeDislikeDto } from "./dtos/comment-with-like-dislike-dto";

@Controller('api/v1/comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}
  
    @Get('get-last-ten-comments/:userId')
    async GetLastTenComments(@Param('userId') userId: number){
        const result = this.commentService.getLastTenComments(userId);
        return result;
    }

    @Delete('delete-comment/:commentId')
    @UseGuards(AuthGuard)
    async DeleteComment(@Param('commentId') commentId: number, @Request() req){
        const isAdmin = req.user.role === 'admin';
        const uId = req.user.uid;
        const result = this.commentService.deleteComment(uId, commentId, isAdmin);
        return result;
    }
  
    @Post('add-comment/:reviewId')
    @UseGuards(AuthGuard)
    async AddReview(@Param('reviewId') reviewId: number, @Request() req, @Body() body: CommentWithLikeDislikeDto){
        const uId = req.user.uid;
        const content = body.content;
        const comment = await this.commentService.addComment(reviewId, uId, content);
        return comment;
    }

    @Get('get-comments-by-review/:reviewId')
    async GetCommentsByReview(@Param('reviewId') reviewId: number){
        const result = this.commentService.getCommentsByReview(reviewId);
        return result;
    }

    @Get('get-comments-by-user/')
    @UseGuards(AuthGuard)
    async GetCommentsByUser(@Request() req){
        const uId = req.user.uid;
        const result = this.commentService.getCommentsByUser(uId);
        return result;
    }

}