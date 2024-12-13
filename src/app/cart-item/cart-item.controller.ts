import { Controller, Get, Param, Patch, Query } from "@nestjs/common";
import { CartItemService } from "./cart-item.service";

@Controller('api/v1/cart-item')
export class CartItemController {
    constructor(private readonly cartItemService: CartItemService) {}

    @Patch('add-item/:bookId')
    async addItemToCart( @Param('bookId') bookId: number, @Query('u_id') userId: number = 0 ) {
        const result = this.cartItemService.addItemToCart(bookId, userId);
        return result;
    }

    @Patch('remove-item/:bookId')
    async removeItemToCart( @Param('bookId') bookId: number, @Query('u_id') userId: number = 0 ) {
        const result = this.cartItemService.removeItemToCart(bookId, userId);
        return result;
    }

    @Get('get-items')
    async getItemsFromCart( @Query('u_id') userId: number = 0 ){
        const result = this.cartItemService.getItemsFromCart(userId);
        return result;
    }

}