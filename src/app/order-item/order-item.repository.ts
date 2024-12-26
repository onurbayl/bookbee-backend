import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { OrderItem } from "./order-item.entity";

@Injectable()
export class OrderItemRepository extends Repository<OrderItem> {
    constructor(private readonly  dataSource: DataSource) {
        super(OrderItem, dataSource.createEntityManager());
    }

    async findByOrder(orderId: number): Promise<OrderItem[]>{
        return this.createQueryBuilder('orderItem')
        .leftJoin('orderItem.order', 'order')
        .leftJoinAndSelect('orderItem.book', 'book')
        .leftJoinAndSelect('orderItem.discount', 'discount')
        .where('order.id = :order_id', {order_id: orderId})
        .getMany();
    }

}