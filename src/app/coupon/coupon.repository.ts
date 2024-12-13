import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Coupon } from "./coupon.entity";

@Injectable()
export class CouponRepository extends Repository<Coupon> {
    constructor(private readonly  dataSource: DataSource) {
        super(Coupon, dataSource.createEntityManager());
    }

    async findActiveByUser(userId: number): Promise<Coupon[]>{
        return this.createQueryBuilder('coupon')
        .leftJoin('coupon.user', 'user')
        .where('user.id = :user_id', {user_id: userId})
        .andWhere('coupon.startDate <= CURRENT_TIMESTAMP')
        .andWhere('coupon.endDate >= CURRENT_TIMESTAMP')
        .andWhere('NOT coupon.used')
        .getMany();
    }

}