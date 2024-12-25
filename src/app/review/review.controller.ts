import { Body, Controller, Param, UseGuards, Request, Get, Post, Delete } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { AuthGuard } from "src/guards/auth.guard";
import { ReviewWithLikeDislikeDto } from "./dtos/review-with-like-dislike-dto";

@Controller('api/v1/review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Post('add-review/:bookId')
    @UseGuards(AuthGuard)
    async AddReview(@Param('bookId') bookId: number, @Request() req, @Body() body: ReviewWithLikeDislikeDto){
        const uId = req.user.uid;
        const score = body.score;
        const content = body.content;
        const review = await this.reviewService.addReview(bookId, uId, score, content);

        return review;
    }

}