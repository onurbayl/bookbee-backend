import { Injectable } from "@nestjs/common";
import { ReviewRepository } from "./review.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../user/user.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { ReviewNotFoundException } from "./exceptions/review-not-found.exception";
import { ReviewWithLikeDislikeDto } from "./dtos/review-with-like-dislike-dto";
import { ReviewLikeDislikeRepository } from "../review-like-dislike/review-like-dislike.repository";
import { BookRepository } from "../book/book.repository";
import { BookNotFoundException } from "../book/exceptions/book-not-found.exception";
import { Review } from "./review.entity";
import { UserUnauthorizedException } from "../user/exceptions/user-unauthorized.exception";
import { ReviewBadRequestException } from "./exceptions/review-bad-request.exception";

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

    async getLastTenReviews(userId: number, uId: string){

        const reqUser = await this.userRepository.findByUId(uId);

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
            reviewDto.userChoice = 0;
            if(reqUser != null){
                const userLike = await this.reviewLikeDislikeRepository.findByReviewAndUser(review.id, reqUser.id);
                if( userLike != null ){
                    reviewDto.userChoice = userLike.likeDislike;
                }
            }
            reviewDto.dateCreated = review.dateCreated;

            reviewsDto.push(reviewDto);
        }
        
        return reviewsDto;
    }

    async deleteReview(uId: string, bookId: number, userId: number, isAdmin: boolean){
        const user = await this.userRepository.findById(userId);
        if(user == null){
            UserNotFoundException.byId(userId);
        }

        if(uId !== user.uid && !isAdmin){
            UserUnauthorizedException.byNotPermitted();
        }
      
        const book = await this.bookRepository.findById(bookId);
        if(book == null){
            BookNotFoundException.byId(bookId);
        }
      
        let review = await this.reviewRepository.findByBookAndUser(bookId, user.id);
      
        if(review == null){
            ReviewNotFoundException.byBookAndUser(bookId, user.id);
        }

        await this.reviewRepository.delete(review);

        return { message: 'This review by the user ' + userId + ' was removed.' }
    }

    async addReview(bookId: number, userUId: string, score: number, content: string){

        const user = await this.userRepository.findByUId(userUId);
        if(user == null){
            UserNotFoundException.byUId();
        }

        const book = await this.bookRepository.findById(bookId);
        if(book == null){
            BookNotFoundException.byId(bookId);
        }
      
        if(score == null || content == null){
            ReviewBadRequestException.byScoreOrContent();
        }

        if(score > 10 || score < 0){
            ReviewBadRequestException.invalidScore();
        }

        let review = await this.reviewRepository.findByBookAndUser(bookId, user.id)

        if(review){
            ReviewBadRequestException.reviewExists(bookId, user.id);   
        }

        review = new Review();
        review.user = user;
        review.book = book;
        review.score = score;
        review.content = content;
        review.dateCreated = new Date();

        return await this.reviewRepository.save(review);
    }

    async getReviewsByBook(bookId: number, uId: string){

        const reqUser = await this.userRepository.findByUId(uId);

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
            reviewDto.userChoice = 0;
            if(reqUser != null){
                const userLike = await this.reviewLikeDislikeRepository.findByReviewAndUser(review.id, reqUser.id);
                if( userLike != null ){
                    reviewDto.userChoice = userLike.likeDislike;
                }
            }
            reviewDto.dateCreated = review.dateCreated;

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
            reviewDto.userChoice = 0;
            const userLike = await this.reviewLikeDislikeRepository.findByReviewAndUser(review.id, user.id);
            if( userLike != null ){
                reviewDto.userChoice = userLike.likeDislike;
            }
            reviewDto.dateCreated = review.dateCreated;

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
        reviewDto.userChoice = 0;
        const userLike = await this.reviewLikeDislikeRepository.findByReviewAndUser(review.id, user.id);
        if( userLike != null ){
            reviewDto.userChoice = await userLike.likeDislike;
        }
        reviewDto.dateCreated = review.dateCreated;
        
        return reviewDto;
    }

    async getReviewsByLikeCountAndUser(uId: string){

        const user = await this.userRepository.findByUId(uId);
        if(user == null){
            UserNotFoundException.byUId();
        }

        let reviews = await this.reviewRepository.findByLikeCountAndUser(user.id);

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
            reviewDto.userChoice = 0;
            const userLike = await this.reviewLikeDislikeRepository.findByReviewAndUser(review.id, user.id);
            if( userLike != null ){
                reviewDto.userChoice = userLike.likeDislike;
            }
            reviewDto.dateCreated = review.dateCreated;

            reviewsDto.push(reviewDto);
        }
  
        return reviewsDto;
    }

    async getAllReviews() {
        // Fetch all reviews from the database
        return this.reviewRepository.findAll();
    }

}