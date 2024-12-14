import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Genre } from "../genre/genre.entity";
import { Exclude } from "class-transformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    //@Exclude()
    uid: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ManyToMany(() => Genre)
    @JoinTable({
        name: 'user_genres',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'genre_id',
            referencedColumnName: 'id'
        },
    })
    favoriteGenres: Genre[];

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    imagePath: string;

    @Column({ type: 'numeric', scale: 2  })
    balance: number;

    @Column({ type: 'varchar', length: 2048 })
    description: string;

    @Column({ default: false })
    isDeleted: boolean;
}