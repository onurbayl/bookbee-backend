import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WishListRepository } from "./wish-list.repository";
import { UserRepository } from "../user/user.repository";
import { BookRepository } from "../book/book.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { WishList } from "./wish-list.entity";

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

    async getItems(userUId: string) {
        const user = await this.userRepository.findByUId(userUId);
        if(user == null){
            UserNotFoundException.byUId();
        }
        //Get all wishlist items by user
        const wishlistItemList: WishList[] = await this.wishListRepository.findByUser(user.id);
        return wishlistItemList;
    }
}