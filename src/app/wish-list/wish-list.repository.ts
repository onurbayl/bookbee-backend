import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WishList } from "./wish-list.entity";

@Injectable()
export class WishListRepository extends Repository<WishList> {
    constructor(private readonly  dataSource: DataSource) {
        super(WishList, dataSource.createEntityManager());
    }

    async findByBookAndUser( bookId: number, userId: number ): Promise<WishList | undefined> {
        return this.createQueryBuilder('wishList')
        .leftJoinAndSelect('wishList.user', 'user')
        .leftJoinAndSelect('wishList.book', 'book')
        .where( 'user.id = :i_user', {i_user: userId} )
        .andWhere( 'book.id = :i_book', {i_book: bookId} )
        .getOne();
    }

    async findByUser(userId: number): Promise<WishList[]> {
        return this.createQueryBuilder('wishList')
        .leftJoinAndSelect('wishList.user', 'user')
        .leftJoinAndSelect('wishList.book', 'book')
        .where( 'user.id = :i_user', {i_user: userId} )
        .getMany();
    }

    async countByBook(bookId: number): Promise<number> {
        const result = await this.createQueryBuilder('wishList')
        .leftJoin('wishList.book', 'book')
        .select('COUNT(DISTINCT wishList.id)', 'distinctWishListCount')
        .where('book.id = :i_book', { i_book: bookId })
        .getRawOne();
    
        return result?.distinctWishListCount ? parseInt(result.distinctWishListCount, 10) : 0;
    }
}