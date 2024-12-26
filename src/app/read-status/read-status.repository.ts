import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ReadStatus } from "./read-status.entity";

@Injectable()
export class ReadStatusRepository extends Repository<ReadStatus> {
    constructor(private readonly  dataSource: DataSource) {
        super(ReadStatus, dataSource.createEntityManager());
    }

    async getReadStatusForUser(userId : number): Promise<ReadStatus[] | undefined> {
    
        return this.createQueryBuilder('readstatus')
        .leftJoinAndSelect('readstatus.user', 'user')
        .leftJoinAndSelect('readstatus.book', 'book')
        .where( 'user.id = :userId', { userId: userId})
        .getMany();

    }

    async getReadStatus(bookId : number, uId: string): Promise<ReadStatus | undefined> {
    
        return this.createQueryBuilder('readstatus')
        .leftJoinAndSelect('readstatus.user', 'user')
        .leftJoinAndSelect('readstatus.book', 'book')
        .where( 'book.id = :bookId', { bookId: bookId})
        .andWhere('user.uid = :uId', {uId: uId})
        .getOne();
    
    }

}