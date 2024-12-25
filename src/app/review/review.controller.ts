import { Body, Controller, Param, UseGuards, Request, Get, Post, Delete, ForbiddenException } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('api/v1/review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Get('get-last-ten-reviews/:userId')
    async GetLastTenComments(@Request() req, @Param('userId') userId: number){
        const uId = req.user.uid;
        const result = this.reviewService.getLastTenReviews(userId);
        return result;
    }

}