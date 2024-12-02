import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Discount } from "./discount.entity";

@Injectable()
export class DiscountRepository extends Repository<Discount> {
    constructor(private readonly  dataSource: DataSource) {
        super(Discount, dataSource.createEntityManager());
    }

    //Add custom repositories

}