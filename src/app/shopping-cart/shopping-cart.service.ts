import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ShoppingCartRepository } from "./shopping-cart.repository";

@Injectable()
export class ShoppingCartService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(ShoppingCartRepository)
        private readonly shoppingCartRepository: ShoppingCartRepository,
    ) {}

    //Add service methods

}