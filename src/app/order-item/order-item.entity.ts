import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../order/order.entity";
import { Book } from "../book/book.entity";
import { Discount } from "../discount/discount.entity";

@Entity()
export class OrderItem {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order)
    @JoinColumn([{ name: 'order_id', referencedColumnName: 'id' }])
    order: Order;

    @ManyToOne(() => Book)
    @JoinColumn([{ name: 'book_id', referencedColumnName: 'id' }])
    book: Book;

    @Column({ type: 'integer' })
    quantity: number;

    @Column({ type: 'numeric' })
    unitPrice: number;

    @ManyToOne(() => Discount, {nullable: true})
    @JoinColumn([{ name: 'discount_id', referencedColumnName: 'id' }])
    discount: Discount | null;

}