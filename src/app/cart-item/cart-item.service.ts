import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartItemRepository } from "./cart-item.repository";

@Injectable()
export class CartItemService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(CartItemRepository)
        private readonly cartItemRepository: CartItemRepository,
    ) {}

    //Add service methods

}