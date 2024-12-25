import { Injectable } from "@nestjs/common";
import { ReviewRepository } from "./review.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../user/user.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { ReviewNotFoundException } from "./exceptions/review-not-found-exception";
import { ReviewWithLikeDislikeDto } from "./dtos/review-with-like-dislike-dto";
import { ReviewLikeDislikeRepository } from "../review-like-dislike/review-like-dislike.repository";

@Injectable()
export class ReviewService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(ReviewRepository)
        private readonly reviewRepository: ReviewRepository,

        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,

        @InjectRepository(ReviewLikeDislikeRepository)
        private readonly reviewLikeDislikeRepository: ReviewLikeDislikeRepository
    ) {}

    async getLastTenReviews(userId: number){
        const user = await this.userRepository.findById(userId);
        if(user == null){
            UserNotFoundException.byId(userId);
        }

        let reviews = await this.reviewRepository.GetTenLast(userId);

        if (!reviews) {
            ReviewNotFoundException.byUser(userId);
        }
        
        let reviewsDto: ReviewWithLikeDislikeDto[] = [];

        for (const review of reviews){

            let reviewDto = new ReviewWithLikeDislikeDto();
            reviewDto.id = review.id;
            reviewDto.user = review.user;
            reviewDto.book = review.book;
            reviewDto.score = review.score;
            reviewDto.content = review.content;
            reviewDto.likeCount = await this.reviewLikeDislikeRepository.getLikeCount(review.id);
            reviewDto.dislikeCount = await this.reviewLikeDislikeRepository.getDislikeCount(review.id);

            reviewsDto.push(reviewDto);
        }
        
        return reviewsDto;
    }

}