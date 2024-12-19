import { Injectable } from "@nestjs/common";
import { Brackets, DataSource, Repository } from "typeorm";
import { Discount } from "./discount.entity";

@Injectable()
export class DiscountRepository extends Repository<Discount> {
    constructor(private readonly  dataSource: DataSource) {
        super(Discount, dataSource.createEntityManager());
    }

    async findByBook( bookId: number ): Promise<Discount | undefined>{
        return this.createQueryBuilder('discount')
        .leftJoin('discount.book', 'book')
        .where( 'book.id = :book_id', {book_id: bookId} )
        .andWhere('discount.startDate <= CURRENT_TIMESTAMP')
        .andWhere('discount.endDate >= CURRENT_TIMESTAMP')
        .getOne();
    }

    async findOverlapByBook(bookId: number, startDate: Date, endDate: Date): Promise<Discount[]>{
        return this.createQueryBuilder('discount')
        .leftJoinAndSelect('discount.book', 'book')
        .andWhere('book.id = :bookId', { bookId })
        .andWhere(':start_date < discount.endDate', {start_date: startDate})
        .andWhere(':end_date > discount.startDate', {end_date: endDate})
        .getMany();
    }

}