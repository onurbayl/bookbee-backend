import { Body, Controller, Param, UseGuards, Request, Get, Post, Delete } from "@nestjs/common";
import { ReviewLikeDislikeService } from "./review-like-dislike.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('api/v1/review-like')
export class ReviewLikeDislikeController {
    constructor(private readonly reviewLikeDislikeService: ReviewLikeDislikeService) {}

    @Post('add-like/:reviewId')
    @UseGuards(AuthGuard)
    async AddLike(@Param('reviewId') reviewId: number, @Request() req, @Body() body: { likeDislike: number }){
        const uId = req.user.uid;
        const {likeDislike} = body;
        const result = this.reviewLikeDislikeService.addLike(uId, reviewId, likeDislike);
        return result;
    }

}