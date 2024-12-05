import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WishListRepository } from "./wish-list.repository";

@Injectable()
export class WishListService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(WishListRepository)
        private readonly wishListRepository: WishListRepository,
    ) {}

    //Add service methods
    
}