import { User } from "src/app/user/user.entity";
import { Review } from "src/app/review/review.entity";

export class CommentWithLikeDislikeDto{

    id: number;
    user: User;
    review: Review;
    content: string;
    likeCount: number;
    dislikeCount: number;
    userChoice: number;
    dateCreated: Date;

}