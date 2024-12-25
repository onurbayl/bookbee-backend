import { forwardRef, Module } from "@nestjs/common";
import { ReviewLikeDislikeController } from "./review-like-dislike.controller";
import { ReviewLikeDislike } from "./review-like-dislike.entity";
import { ReviewLikeDislikeRepository } from "./review-like-dislike.repository";
import { ReviewLikeDislikeService } from "./review-like-dislike.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReviewModule } from "../review/review.module";
import { UserModule } from "../user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([ReviewLikeDislike]), forwardRef(() => ReviewModule), UserModule],
    controllers: [ReviewLikeDislikeController],
    providers: [ReviewLikeDislikeService, ReviewLikeDislikeRepository],
    exports: [ReviewLikeDislikeRepository],
})
export class ReviewLikeDislikeModule {}