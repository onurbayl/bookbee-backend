import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "../book/book.entity";

@Entity()
export class Discount {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Book)
    @JoinColumn([{ name: 'book_id', referencedColumnName: 'id' }])
    book: Book;

    @Column({ type: 'integer' })
    discountPercentage: number;

    @Column({ type: 'timestamp' })
    startDate: Date;

    @Column({ type: 'timestamp' })
    endDate: Date;

}