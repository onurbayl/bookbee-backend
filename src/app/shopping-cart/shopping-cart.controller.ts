import { Controller } from "@nestjs/common";
import { ShoppingCartService } from "./shopping-cart.service";

@Controller('api/v1/shopping-cart')
export class ShoppingCartController {
    constructor(private readonly shoppingCartService: ShoppingCartService) {}

    //Add api endpoints

}