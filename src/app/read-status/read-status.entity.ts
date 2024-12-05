import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Book } from "../book/book.entity";

@Entity()
export class ReadStatus {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
    user : User

    @ManyToOne(() => Book)
    @JoinColumn([{ name: 'book_id', referencedColumnName: 'id' }])
    book : Book

    @Column({ type: 'varchar', length: 256 })
    status: string;

    @Column({ type: 'timestamp' })
    readDate : Date

}