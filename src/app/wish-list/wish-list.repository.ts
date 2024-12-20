import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WishList } from "./wish-list.entity";

@Injectable()
export class WishListRepository extends Repository<WishList> {
    constructor(private readonly  dataSource: DataSource) {
        super(WishList, dataSource.createEntityManager());
    }

    async findByUser(userId: number): Promise<WishList[]> {
        return this.createQueryBuilder('wishList')
        .leftJoinAndSelect('wishList.user', 'user')
        .leftJoinAndSelect('wishList.book', 'book')
        .andWhere( 'user.id = :i_user', {i_user: userId} )
        .getMany();
    }
}