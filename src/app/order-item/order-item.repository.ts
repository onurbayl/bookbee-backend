import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { Order } from "../order/order.entity";
import { Book } from "../book/book.entity";

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

    async findSalesGroup(publisherId: number
        ): Promise<{ date: string; quantity: string, revenue: string }[]> {
        return await this.createQueryBuilder('orderItem')
        .select('DATE("order"."orderDate")', 'date')
        .addSelect('SUM("orderItem"."quantity")', 'quantity')
        .addSelect('SUM("orderItem"."unitPrice")', 'revenue')
        .where('book.publisher_id = :i_publisher', { i_publisher: publisherId })
        .innerJoin(Order, 'order', '"orderItem"."order_id" = "order"."id"')
        .innerJoin(Book, 'book', '"orderItem"."book_id" = "book"."id"')
        .groupBy('DATE("order"."orderDate")')
        .orderBy('date', 'ASC')
        .getRawMany();
    }    
}