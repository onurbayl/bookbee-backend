import { Injectable } from "@nestjs/common";
import { ReviewRepository } from "./review.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { BookRepository } from "../book/book.repository";
import { BookNotFoundException } from "../book/exceptions/book-not-found.exception";
import { UserRepository } from "../user/user.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { Review } from "./review.entity";
import { ReviewNotFoundException } from "./exceptions/review-not-found-exception";
import { ReviewWithLikeDislikeDto } from "./dtos/review-with-like-dislike-dto";
import { ReviewLikeDislikeRepository } from "../review-like-dislike/review-like-dislike.repository";

@Injectable()
export class ReviewService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(ReviewRepository)
        private readonly reviewRepository: ReviewRepository,

        @InjectRepository(BookRepository)
        private readonly bookRepository: BookRepository,

        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,

        @InjectRepository(ReviewLikeDislikeRepository)
        private readonly reviewLikeDislikeRepository: ReviewLikeDislikeRepository
    ) {}

    async getReviewsByBook(bookId: number){

        const book = await this.bookRepository.findById(bookId);
        if(book == null){
            BookNotFoundException.byId(bookId);
        }

        let reviews = await this.reviewRepository.findByBook(bookId);

        if (!reviews) {
            ReviewNotFoundException.byBook(bookId);
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

    async getReviewsByUser(userUId: string){
      
        const user = await this.userRepository.findByUId(userUId);
        if(user == null){
            UserNotFoundException.byUId();
        }

        let reviews = await this.reviewRepository.findByUser(user.id);

        if (!reviews) {
            ReviewNotFoundException.byUser(user.id);
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

    async getReview(bookId: number, userUId: string){
  
        const user = await this.userRepository.findByUId(userUId);
        if(user == null){
            UserNotFoundException.byUId();
        }
  
        const book = await this.bookRepository.findById(bookId);
        if(book == null){
            BookNotFoundException.byId(bookId);
        }

        let review = await this.reviewRepository.findByBookAndUser(bookId, user.id);

        if (!review) {
            ReviewNotFoundException.byBookAndUser(bookId, user.id);
        }

        let reviewDto = new ReviewWithLikeDislikeDto();
        reviewDto.id = review.id;
        reviewDto.user = review.user;
        reviewDto.book = review.book;
        reviewDto.score = review.score;
        reviewDto.content = review.content;
        reviewDto.likeCount = await this.reviewLikeDislikeRepository.getLikeCount(review.id);
        reviewDto.dislikeCount = await this.reviewLikeDislikeRepository.getDislikeCount(review.id);
        
        return reviewDto;
    }

}