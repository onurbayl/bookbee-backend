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

    async findActiveById(couponId: number): Promise<Coupon | undefined>{
        return this.createQueryBuilder('coupon')
        .where('coupon.id = :coupon_id', {coupon_id: couponId})
        .leftJoinAndSelect('coupon.user', 'user')
        .andWhere('coupon.startDate <= CURRENT_TIMESTAMP')
        .andWhere('coupon.endDate >= CURRENT_TIMESTAMP')
        .andWhere('NOT coupon.used')
        .getOne();
    }

}