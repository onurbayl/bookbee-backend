import { Body, Controller, Param, UseGuards, Request, Get, Post, Delete } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('api/v1/review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Delete('delete-review/:bookId/:userId')
    @UseGuards(AuthGuard)
    async DeleteReview(@Param('bookId') bookId: number, @Param('userId') userId: number, @Request() req){
        const uId = req.user.uid;
        const result = this.reviewService.deleteReview(bookId, userId);
        return result;
    }

}