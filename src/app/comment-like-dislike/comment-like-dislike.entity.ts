import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Comment } from "../comment/comment.entity";

@Entity()
export class CommentLikeDislike {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
    user: User;

    @ManyToOne(() => Comment, { onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'comment_id', referencedColumnName: 'id' }])
    comment: Comment;

    @Column({ type: 'integer' })
    likeDislike: number;

    @Column({ type: 'timestamp' })
    dateCreated: Date

}