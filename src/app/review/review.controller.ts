import { Body, Controller, Param, UseGuards, Request, Get, Post, Delete } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('api/v1/review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Post('add-review/:bookId')
    @UseGuards(AuthGuard)
    async AddReview(@Param('bookId') bookId: number, @Request() req, @Body() body: { score: number; content: string }){
        const uId = req.user.uid;
        const {score, content} = body;
        const result = this.reviewService.addReview(bookId, uId, score, content);
        return result;
    }

}