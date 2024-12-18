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
import { DiscountRepository } from "../discount/discount.repository";
import { cartItemWithPriceDto } from "./dtos/cart-item-with-price-dto";
import { Discount } from "../discount/discount.entity";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";

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

        @InjectRepository(DiscountRepository)
        private readonly discountRepository: DiscountRepository,
    ) {}

    async addItemToCart(bookId: number, userUId: string) {

        const user = await this.userRepository.findByUId(userUId);
        if(user == null){
            UserNotFoundException.byUId();
        }
        //Find cart by user
        const cart = await this.shoppingCartRepository.findByUser(user.id);
        if(cart == null){
            ShoppingCartNotFoundException.byId(user.id);
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

    async removeItemToCart(bookId: number, userUId: string) {

        const user = await this.userRepository.findByUId(userUId)
        if(user == null){
            UserNotFoundException.byUId();
        }

        //Find cart by user
        const cart = await this.shoppingCartRepository.findByUser(user.id);
        if(cart == null){
            ShoppingCartNotFoundException.byId(user.id);
        }

        //Get Book by id
        const book = await this.bookRepository.findById(bookId);
        if(book == null){
            BookNotFoundException.byId(bookId);
        }

        //Check if cart item exists
        let cartItem = await this.cartItemRepository.findByBookAndCart(bookId, cart.id);
        if( cartItem == null ){
            CartItemNotFoundException.byBookAndUser(bookId, user.id);
        }

        if( cartItem.quantity == 1 ){ //If quantity 1, delete it.
            await this.cartItemRepository.delete(cartItem);
            return { message: 'This item with ID ' + bookId.toString() + ' removed from shopping cart.' }
        } else{ //Otherwise, save updated value.
            cartItem.quantity -= 1;
            return await this.cartItemRepository.save(cartItem);
        }
    }

    async getItemsFromCart(userUId: string) {

        const user = await this.userRepository.findByUId(userUId)
        if(user == null){
            UserNotFoundException.byUId();
        }

        //Find cart by user
        const cart = await this.shoppingCartRepository.findByUser(user.id);
        if(cart == null){
            ShoppingCartNotFoundException.byId(user.id);
        }

        //Get all cart items by user
        const cartItemList = await this.cartItemRepository.findByCart(cart.id);

        let cartItemDtoList: cartItemWithPriceDto[] = [];

        //Get all discount for all items inside cart
        for( const item of cartItemList ){

            const discount: Discount = await this.discountRepository.findByBook(item.book.id);

            const newDto = new cartItemWithPriceDto();
            newDto.id = item.id;
            newDto.book = item.book;
            newDto.quantity = item.quantity;
            newDto.normalPrice = item.quantity * item.book.price;
            if( discount == null ){
                newDto.discountPercentage = 0;
                newDto.finalPrice = newDto.normalPrice;
            } else {
                newDto.discountPercentage = discount.discountPercentage;
                newDto.finalPrice = parseFloat( (newDto.normalPrice * ( 100 - discount.discountPercentage ) / 100).toFixed(2) );
            }

            cartItemDtoList.push(newDto);
        }

        return cartItemDtoList;
    }

}