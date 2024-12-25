import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReviewLikeDislikeRepository } from "./review-like-dislike.repository";
import { UserRepository } from "../user/user.repository";
import { ReviewRepository } from "../review/review.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { ReviewNotFoundException } from "../review/exceptions/review-not-found.exception";

@Injectable()
export class ReviewLikeDislikeService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(ReviewLikeDislikeRepository)
        private readonly reviewLikeDislikeRepository: ReviewLikeDislikeRepository,

        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,

        @InjectRepository(ReviewRepository)
        private readonly reviewRepository: ReviewRepository
    ) {}

    async addDislike(userUId: string, reviewId: number){

        const user = await this.userRepository.findByUId(userUId);
        if(user == null){
            UserNotFoundException.byUId();
        }
        
        const review = await this.reviewRepository.findById(reviewId);
        if(review == null){
            ReviewNotFoundException.byId(reviewId);
        }

        let existingRecord = await this.reviewLikeDislikeRepository.findByReviewAndUser(reviewId, user.id);

        if(existingRecord && existingRecord.likeDislike == -1){
            await this.reviewLikeDislikeRepository.delete(existingRecord);
            return { message: 'A record has been deleted as it was -1.' }
        }
        
        if(existingRecord && existingRecord.likeDislike == 1){
            existingRecord.likeDislike = -1;
            await this.reviewLikeDislikeRepository.save(existingRecord);
            return { message: 'A record has been changed as it was 1.' };
        }

        if(!existingRecord){
            existingRecord = new ReviewLikeDislike;
            existingRecord.user = user;
            existingRecord.review = review;
            existingRecord.dateCreated = new Date();
            existingRecord.likeDislike = -1;
            await this.reviewLikeDislikeRepository.save(existingRecord);
            return { message: 'A record has been created as there was none.' };
        }

    }

}