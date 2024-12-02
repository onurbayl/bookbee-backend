import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Coupon } from "./coupon.entity";

@Injectable()
export class CouponRepository extends Repository<Coupon> {
    constructor(private readonly  dataSource: DataSource) {
        super(Coupon, dataSource.createEntityManager());
    }

    //Add custom repositories

}