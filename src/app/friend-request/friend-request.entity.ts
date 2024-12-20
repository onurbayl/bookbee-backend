import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class FriendRequest {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn([{ name: 'sender_id', referencedColumnName: 'id' }])
    sender : User

    @ManyToOne(() => User)
    @JoinColumn([{ name: 'reciever_id', referencedColumnName: 'id' }])
    receiver : User

    @Column({ type: 'timestamp' })
    dateRequest : Date

    @Column({ type: 'timestamp', nullable: true })
    dateAnswered : Date | null;

}