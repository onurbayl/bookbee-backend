import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { User } from "../user/user.entity"
import { Genre } from "../genre/genre.entity";

@Entity()
export class Book {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 2048 })
    description: string;

    @Column({ type: 'numeric', scale: 2 })
    price: number;

    @ManyToOne(() => User)
    @JoinColumn([{ name: 'publisher_id', referencedColumnName: 'id' }])
    publisher : User

    @ManyToMany(() => Genre )
    @JoinTable({
        name: 'book_genres',
        joinColumn: {
            name: 'book_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'genre_id',
            referencedColumnName: 'id',
        },
    })
    genres: Genre[];

    @Column({ type: 'varchar', length: 255 })
    writer: string;

    @Column({ type: 'integer', scale: 2 })
    pageNumber: number;

    @Column({ type: 'date' })
    datePublished: number;

    @Column({ type: 'varchar', length: 255 })
    language: string;

    @Column({ type: 'varchar', length: 255 })
    bookDimension: string;

    @Column({ type: 'varchar', length: 255 })
    barcode: string;

    @Column({ type: 'varchar', length: 255 })
    isbn: string;

    @Column({ type: 'varchar', length: 255 })
    editionNumber: string;

    @Column({ type: 'varchar', length: 255 })
    imagePath: string;

    @Column()
    isDeleted: boolean;
}