import { Injectable } from "@nestjs/common";
import { ReviewRepository } from "./review.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { BookRepository } from "../book/book.repository";
import { BookNotFoundException } from "../book/exceptions/book-not-found.exception";
import { UserRepository } from "../user/user.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { Review } from "./review.entity";
import { ReviewNotFoundException } from "./exceptions/review-not-found-exception";
import { UserUnauthorizedException } from "../user/exceptions/user-unauthorized.exception";

@Injectable()
export class ReviewService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(ReviewRepository)
        private readonly reviewRepository: ReviewRepository,

        @InjectRepository(BookRepository)
        private readonly bookRepository: BookRepository,

        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository
    ) {}

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

}