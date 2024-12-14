import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from "./user.entity";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private readonly  dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    //Write custom queries

    async findById(iId : number): Promise<User | undefined> {

        return this.findOne( {
            where: { id: iId },
            relations: ['favoriteGenres'],
        } );
        
    }

    async findByUId(uId : string): Promise<User | undefined> {

        return this.findOne({ 
            where: { uid: uId },
            relations: ['favoriteGenres'],
        });
        
    }

    async findByEmail(email : string): Promise<User | undefined> {

        return this.findOne({ 
            where: { email }
        });
        
    }

    async findAll(): Promise<User[]> {

        return await this.find({
            relations: ['favoriteGenres'], // Load related genres if needed
        });
        
    }


}