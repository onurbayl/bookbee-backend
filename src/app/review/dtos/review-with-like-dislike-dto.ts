import { Book } from "src/app/book/book.entity";
import { User } from "src/app/user/user.entity";

export class ReviewWithLikeDislikeDto{

    id: number;
    user: User;
    book: Book;
    score: number;
    content: string;
    likeCount: number;
    dislikeCount: number;
    userChoice: number;
    dateCreated: Date;

}