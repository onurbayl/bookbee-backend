import { Controller } from "@nestjs/common";
import { CartItemService } from "./cart-item.service";

@Controller('api/v1/cart-item')
export class CartItemController {
    constructor(private readonly cartItemService: CartItemService) {}

    //Add api endpoints

}