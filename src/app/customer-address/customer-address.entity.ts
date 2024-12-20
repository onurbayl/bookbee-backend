import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Timestamp } from "typeorm";
import { User } from "../user/user.entity"

@Entity()
export class CustomerAddress {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
    user : User;

    @Column({ type: 'varchar', length: 2048 })
    addressInfo: string;

    @Column({ default: true })
    current: boolean

    @Column({ type: 'timestamp' })
    startDate : Date;

    @Column({ type: 'timestamp', nullable: true })
    endDate : Date | null;

}