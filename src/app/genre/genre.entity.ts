import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Genre {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 256, unique: true })
    name: string;

}