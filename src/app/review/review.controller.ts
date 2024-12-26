import { Body, Controller, Param, UseGuards, Request, Get, Post, Delete, UseInterceptors } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { AuthGuard } from "src/guards/auth.guard";
import { ReviewWithLikeDislikeDto } from "./dtos/review-with-like-dislike-dto";
import { FirebaseAuthInterceptor } from "src/interceptors/firebase-auth.interceptor";

@Controller('api/v1/review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}
  
    @Delete('delete-review/:bookId/:userId')
    @UseGuards(AuthGuard)
    async DeleteReview(@Param('bookId') bookId: number, @Param('userId') userId: number, @Request() req){
        const isAdmin = req.user.role === 'admin';
        const uId = req.user.uid;
        const result = this.reviewService.deleteReview(uId, bookId, userId, isAdmin);
        return result;
    }
  
    @Get('get-last-ten-reviews/:userId')
    @UseInterceptors(FirebaseAuthInterceptor)
    async GetLastTenComments(@Param('userId') userId: number, @Request() req){
        const uId = req.firebaseUid;
        const result = this.reviewService.getLastTenReviews(userId, uId);
        return result;
    }
  
    @Post('add-review/:bookId')
    @UseGuards(AuthGuard)
    async AddReview(@Param('bookId') bookId: number, @Request() req, @Body() body: ReviewWithLikeDislikeDto){
        const uId = req.user.uid;
        const score = body.score;
        const content = body.content;
        const review = await this.reviewService.addReview(bookId, uId, score, content);

        return review;
    }

    @Get('get-reviews-book/:bookId')
    @UseInterceptors(FirebaseAuthInterceptor)
    async getReviewsByBook(@Param('bookId') bookId: number,  @Request() req){
        const uId = req.firebaseUid;
        const result = this.reviewService.getReviewsByBook(bookId, uId);
        return result;
    }
  
    @Get('get-reviews-user')
    @UseGuards(AuthGuard)
    async getReviewsByUser(@Request() req){
        const uId = req.user.uid;
        const result = this.reviewService.getReviewsByUser(uId);
        return result;
    }
  
    @Get('get-review/:bookId')
    @UseGuards(AuthGuard)
    async GetReview(@Param('bookId') bookId: number, @Request() req){
        const uId = req.user.uid;
        const result = this.reviewService.getReview(bookId, uId);
        return result;
    }

}