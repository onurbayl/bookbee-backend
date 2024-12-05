import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Review } from "../review/review.entity";

@Entity()
export class ReviewLikeDislike {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
    user: User;

    @ManyToOne(() => Review)
    @JoinColumn([{ name: 'review_id', referencedColumnName: 'id' }])
    review: Review;

    @Column({ type: 'integer' })
    likeDislike: number;

    @Column({ type: 'timestamp' })
    dateCreated: Date

}