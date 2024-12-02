import { Module } from "@nestjs/common";
import { ReviewLikeDislikeController } from "./review-like-dislike.controller";
import { ReviewLikeDislike } from "./review-like-dislike.entity";
import { ReviewLikeDislikeRepository } from "./review-like-dislike.repository";
import { ReviewLikeDislikeService } from "./review-like-dislike.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([ReviewLikeDislike])],
    controllers: [ReviewLikeDislikeController],
    providers: [ReviewLikeDislikeService, ReviewLikeDislikeRepository],
    exports: [ReviewLikeDislikeRepository],
})
export class ReviewLikeDislikeModule {}