import { Body, Controller, Param, UseGuards, Request, Get, Post, Delete } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { AuthGuard } from "src/guards/auth.guard";
import { ReviewWithLikeDislikeDto } from "./dtos/review-with-like-dislike-dto";

@Controller('api/v1/review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Post('add-review/:bookId')
    @UseGuards(AuthGuard)
    async AddReview(@Param('bookId') bookId: number, @Request() req, @Body() body: { score: number; content: string }){
        const uId = req.user.uid;
        const {score, content} = body;
        const review = await this.reviewService.addReview(bookId, uId, score, content);

        const reviewDto = new ReviewWithLikeDislikeDto;

        reviewDto.id = review.id;
        reviewDto.user = review.user;
        reviewDto.book = review.book;
        reviewDto.score = review.score;
        reviewDto.content = review.content;
        reviewDto.likeCount = 0; //As it will be a new review.
        reviewDto.dislikeCount = 0; //As it will be a new review.
        reviewDto.dateCreated = review.dateCreated;

        return reviewDto;
    }

}