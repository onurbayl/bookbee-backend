import { Body, Controller, Param, UseGuards, Request, Get, Post, Delete } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { AuthGuard } from "src/guards/auth.guard";
import { CommentWithLikeDislikeDto } from "./dtos/comment-with-like-dislike-dto";


@Controller('api/v1/comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post('add-comment/:reviewId')
    @UseGuards(AuthGuard)
    async AddReview(@Param('reviewId') reviewId: number, @Request() req, @Body() body: { content: string }){
        const uId = req.user.uid;
        const {content} = body;
        const comment = await this.commentService.addComment(reviewId, uId, content);

        const commentDto = new CommentWithLikeDislikeDto;

        commentDto.id = comment.id;
        commentDto.user = comment.user;
        commentDto.review = comment.review;
        commentDto.content = comment.content;
        commentDto.likeCount = 0; //As it will be a new comment.
        commentDto.dislikeCount = 0; //As it will be a new comment.
        commentDto.dateCreated = comment.dateCreated;

        return commentDto;
    }

}