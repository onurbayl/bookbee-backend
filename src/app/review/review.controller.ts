import { Body, Controller, Param, UseGuards, Request, Get, Post, Delete } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('api/v1/review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Get('get-reviews-book/:bookId')
    @UseGuards(AuthGuard)
    async getReviewsByBook(@Param('bookId') bookId: number, @Request() req){
        const uId = req.user.uid;
        const result = this.reviewService.getReviewsByBook(bookId);
        return result;
    }

}