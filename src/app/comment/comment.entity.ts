import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Review } from "../review/review.entity";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
    user: User;

    @ManyToOne(() => Review, { onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'review_id', referencedColumnName: 'id' }])
    review: Review;

    @Column({ type: 'varchar', length: 2048 })
    content: string;

    @Column({ type: 'timestamp' })
    dateCreated: Date;

}