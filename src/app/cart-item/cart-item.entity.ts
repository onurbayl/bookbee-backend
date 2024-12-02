import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ShoppingCart } from "../shopping-cart/shopping-cart.entity";
import { Book } from "../book/book.entity";

@Entity()
export class CartItem {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ShoppingCart)
    @JoinColumn([{ name: 'cart_id', referencedColumnName: 'id' }])
    cart: ShoppingCart;

    @ManyToOne(() => Book)
    @JoinColumn([{ name: 'book_id', referencedColumnName: 'id' }])
    book: Book;

    @Column({ type: 'integer' })
    quantity: number;

}