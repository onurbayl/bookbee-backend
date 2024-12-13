import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { CartItem } from "./cart-item.entity";

@Injectable()
export class CartItemRepository extends Repository<CartItem> {
    constructor(private readonly  dataSource: DataSource) {
        super(CartItem, dataSource.createEntityManager());
    }

    async findByBookAndCart( bookId: number, cartId: number ): Promise<CartItem | undefined> {
        return this.createQueryBuilder('cartItem')
        .leftJoinAndSelect('cartItem.cart', 'cart')
        .leftJoinAndSelect('cart.user', 'user')
        .leftJoinAndSelect('cartItem.book', 'book')
        .where( 'cart.id = :i_cart', {i_cart: cartId} )
        .andWhere( 'book.id = :i_book', {i_book: bookId} )
        .getOne();
    }

    async findByCart( cartId: number ): Promise<CartItem[]> {
        return this.createQueryBuilder('cartItem')
        .leftJoinAndSelect('cartItem.cart', 'cart')
        .leftJoinAndSelect('cart.user', 'user')
        .leftJoinAndSelect('cartItem.book', 'book')
        .where( 'cart.id = :i_cart', {i_cart: cartId} )
        .getMany();
    }

}