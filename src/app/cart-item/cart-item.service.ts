import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartItemRepository } from "./cart-item.repository";
import { UserRepository } from "../user/user.repository";
import { BookRepository } from "../book/book.repository";
import { BookNotFoundException } from "../book/exceptions/book-not-found.exception";
import { ShoppingCartRepository } from "../shopping-cart/shopping-cart.repository";
import { ShoppingCartNotFoundException } from "../shopping-cart/exceptions/shopping-cart-not-found.exception";
import { CartItem } from "./cart-item.entity";
import { CartItemNotFoundException } from "./exceptions/cart-item-not-found.exception";

@Injectable()
export class CartItemService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(CartItemRepository)
        private readonly cartItemRepository: CartItemRepository,

        @InjectRepository(ShoppingCartRepository)
        private readonly shoppingCartRepository: ShoppingCartRepository,

        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,

        @InjectRepository(BookRepository)
        private readonly bookRepository: BookRepository,
    ) {}

    async addItemToCart(bookId: number, userId: number) {

        //Find cart by user
        const cart = await this.shoppingCartRepository.findByUser(userId);
        if(cart == null){
            ShoppingCartNotFoundException.byId(userId);
        }

        //Get Book by id
        const book = await this.bookRepository.findById(bookId);
        if(book == null){
            BookNotFoundException.byId(bookId);
        }

        //Check if cart item exists
        let cartItem = await this.cartItemRepository.findByBookAndCart(bookId, cart.id);
        // - No: create new cart-item and save
        if( cartItem == null ){
            cartItem = new CartItem();
            cartItem.book = book;
            cartItem.cart = cart;
            cartItem.quantity = 1;
        }
        // - Yes: update quantity and save
        else{
            cartItem.quantity += 1;
        }

        return await this.cartItemRepository.save(cartItem);
    }

    async removeItemToCart(bookId: number, userId: number) {

        //Find cart by user
        const cart = await this.shoppingCartRepository.findByUser(userId);
        if(cart == null){
            ShoppingCartNotFoundException.byId(userId);
        }

        //Get Book by id
        const book = await this.bookRepository.findById(bookId);
        if(book == null){
            BookNotFoundException.byId(bookId);
        }

        //Check if cart item exists
        let cartItem = await this.cartItemRepository.findByBookAndCart(bookId, cart.id);
        if( cartItem == null ){
            CartItemNotFoundException.byBookAndUser(bookId, userId);
        }

        if( cartItem.quantity == 1 ){ //If quantity 1, delete it.
            await this.cartItemRepository.delete(cartItem);
            return { message: 'This item with ID ' + bookId.toString() + ' removed from shopping cart.' }
        } else{ //Otherwise, save updated value.
            cartItem.quantity -= 1;
            return await this.cartItemRepository.save(cartItem);
        }
    }

}