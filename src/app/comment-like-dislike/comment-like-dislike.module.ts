import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentLikeDislike } from "./comment-like-dislike.entity";
import { CommentLikeDislikeRepository } from "./comment-like-dislike.repository";
import { CommentLikeDislikeService } from "./comment-like-dislike.service";
import { CommentLikeDislikeController } from "./comment-like-dislike.controller";
import { CommentModule } from "../comment/comment.module";
import { UserModule } from "../user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([CommentLikeDislike]), forwardRef(() => CommentModule), UserModule],
    controllers: [CommentLikeDislikeController],
    providers: [CommentLikeDislikeService, CommentLikeDislikeRepository],
    exports: [CommentLikeDislikeRepository],
})
export class CommentLikeDislikeModule {}