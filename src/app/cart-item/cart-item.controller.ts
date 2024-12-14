import { Controller, Get, Param, Patch, Query, Request, UseGuards } from "@nestjs/common";
import { CartItemService } from "./cart-item.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('api/v1/cart-item')
export class CartItemController {
    constructor(private readonly cartItemService: CartItemService) {}

    @Patch('add-item/:bookId')
    @UseGuards(AuthGuard)
    async addItemToCart( @Param('bookId') bookId: number, @Request() req ) {
        const uId = req.user.uid
        console.log(uId)
        const result = this.cartItemService.addItemToCart(bookId, uId);
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