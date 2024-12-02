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
        } );
        
    }


}