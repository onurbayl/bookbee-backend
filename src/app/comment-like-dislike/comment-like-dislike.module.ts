import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentLikeDislike } from "./comment-like-dislike.entity";
import { CommentLikeDislikeRepository } from "./comment-like-dislike.repository";
import { CommentLikeDislikeService } from "./comment-like-dislike.service";
import { CommentLikeDislikeController } from "./comment-like-dislike.controller";

@Module({
    imports: [TypeOrmModule.forFeature([CommentLikeDislike])],
    controllers: [CommentLikeDislikeController],
    providers: [CommentLikeDislikeService, CommentLikeDislikeRepository],
    exports: [CommentLikeDislikeRepository],
})
export class CommentLikeDislikeModule {}