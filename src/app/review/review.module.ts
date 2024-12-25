import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { ReviewRepository } from "./review.repository";
import { UserModule } from "../user/user.module";
import { BookModule } from "../book/book.module";
import { ReviewLikeDislikeModule } from "../review-like-dislike/review-like-dislike.module";

@Module({
    imports: [TypeOrmModule.forFeature([Review]), UserModule, BookModule, forwardRef(() => ReviewLikeDislikeModule)],
    controllers: [ReviewController],
    providers: [ReviewService, ReviewRepository],
    exports: [ReviewRepository],
})
export class ReviewModule {}