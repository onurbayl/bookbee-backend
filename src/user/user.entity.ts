import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    oidc_id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    imagePath: string;

    @Column({ type: 'numeric', scale: 2  })
    balance: string;

    @Column({ type: 'varchar', length: 2048 })
    description: string;

    @Column()
    isDeleted: boolean;
}