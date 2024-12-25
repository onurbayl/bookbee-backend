import { Controller, Param, UseGuards, Request, Get } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('api/v1/review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Get('get-review/:bookId')
    @UseGuards(AuthGuard)
    async GetReview(@Param('bookId') bookId: number, @Request() req){
        const uId = req.user.uid;
        const result = this.reviewService.getReview(bookId, uId);
        return result;
    }

}