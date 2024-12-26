import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Order } from "./order.entity";

@Injectable()
export class OrderRepository extends Repository<Order> {
    constructor(private readonly  dataSource: DataSource) {
        super(Order, dataSource.createEntityManager());
    }

    async findByUser(userId: number): Promise<Order[]>{
        return this.createQueryBuilder('order')
        .leftJoinAndSelect('order.user', 'user')
        .leftJoinAndSelect('order.usedCoupon', 'coupon')
        .leftJoinAndSelect('order.address', 'address')
        .where('user.id = :user_id', {user_id: userId})
        .getMany();
    }

}