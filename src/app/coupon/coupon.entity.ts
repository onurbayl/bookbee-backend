import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class Coupon {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
    user: User;

    @Column({ type: 'integer' })
    discountPercentage: number;

    @Column({ type: 'timestamp' })
    startDate: Date;

    @Column({ type: 'timestamp' })
    endDate: Date;

    @Column({ default: false })
    used: boolean;

}