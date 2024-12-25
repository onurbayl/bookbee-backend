import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from './comment.entity'
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { CommentRepository } from "./comment.repository";
import { ReviewModule } from "../review/review.module";
import { UserModule } from "../user/user.module";
import { CommentLikeDislikeModule } from "../comment-like-dislike/comment-like-dislike.module";

@Module({
    imports: [TypeOrmModule.forFeature([Comment]), ReviewModule, UserModule, forwardRef(() => CommentLikeDislikeModule)],
    controllers: [CommentController],
    providers: [CommentService, CommentRepository],
    exports: [CommentRepository],
})
export class CommentModule {}