import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WishList } from "./wish-list.entity";

@Injectable()
export class WishListRepository extends Repository<WishList> {
    constructor(private readonly  dataSource: DataSource) {
        super(WishList, dataSource.createEntityManager());
    }

    //Add custom repositories

}