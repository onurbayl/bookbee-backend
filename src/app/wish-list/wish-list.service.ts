import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WishListRepository } from "./wish-list.repository";
import { UserRepository } from "../user/user.repository";
import { BookRepository } from "../book/book.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { BookNotFoundException } from "../book/exceptions/book-not-found.exception";
import { WishList } from "./wish-list.entity";
import { WishListItemNotFoundException } from "./exceptions/wishlist-item-not-found.exception";

@Injectable()
export class WishListService {
    constructor( 
        @InjectRepository(WishListRepository)
        private readonly wishListRepository: WishListRepository,
        
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,

        @InjectRepository(BookRepository)
        private readonly bookRepository: BookRepository
    ) {}

    async addItem(bookId: number, userUId: string) {
        const user = await this.userRepository.findByUId(userUId);
        if(user == null){
            UserNotFoundException.byUId();
        }
        
        //Get Book by id
        const book = await this.bookRepository.findById(bookId);
        if(book == null){
            BookNotFoundException.byId(bookId);
        }

        //Check if item already exists
        let wish = await this.wishListRepository.findByBookAndUser(bookId, user.id);
        // - No: create a new wish and save
        if( wish == null ){
            wish = new WishList();
            wish.user = user;
            wish.book = book;
            wish.dateAdded = new Date();
        }
        // - Yes: return it
        else{
            return wish;
        }

        return await this.wishListRepository.save(wish);
    }

    async getItems(userUId: string) {
        const user = await this.userRepository.findByUId(userUId);
        if(user == null){
            UserNotFoundException.byUId();
        }
        //Get all wishlist items by user
        const wishlistItemList: WishList[] = await this.wishListRepository.findByUser(user.id);
        return wishlistItemList;
    }

    async removeItem(bookId: number, userUId: string) {
        const user = await this.userRepository.findByUId(userUId);
        if(user == null){
            UserNotFoundException.byUId();
        }

        //Get Book by id
        const book = await this.bookRepository.findById(bookId);
        if(book == null){
            BookNotFoundException.byId(bookId);
        }

        //Check if book exists in wishlist
        let wish = await this.wishListRepository.findByBookAndUser(bookId, user.id);
        if( wish == null ){
            WishListItemNotFoundException.byBookAndUser(bookId, user.id);
        }

        await this.wishListRepository.delete(wish);
        return { message: 'This book with ID ' + bookId.toString() + ' removed from wishlist.' }
    }
}