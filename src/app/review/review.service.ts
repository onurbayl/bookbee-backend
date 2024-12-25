import { Injectable } from "@nestjs/common";
import { ReviewRepository } from "./review.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { BookRepository } from "../book/book.repository";
import { BookNotFoundException } from "../book/exceptions/book-not-found.exception";
import { UserRepository } from "../user/user.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { Review } from "./review.entity";
import { ReviewNotFoundException } from "./exceptions/review-not-found-exception";
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
            ReviewNotFoundException.byScoreOrContent();
        }

        let review = await this.reviewRepository.findByBookAndUser(bookId, user.id)

        if(review){
            ReviewNotFoundException.reviewExists(bookId, user.id);   
        }

        review = new Review();
        review.user = user;
        review.book = book;
        review.score = score;
        review.content = content;
        review.dateCreated = new Date();

        return await this.reviewRepository.save(review);

    }

}