import { Controller, Get, Param, Patch, Query, Request, UseGuards } from "@nestjs/common";
import { CartItemService } from "./cart-item.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('api/v1/cart-item')
export class CartItemController {
    constructor(private readonly cartItemService: CartItemService) {}

    @Patch('add-item/:bookId')
    @UseGuards(AuthGuard)
    async addItemToCart( @Param('bookId') bookId: number, @Request() req ) {
        const uId = req.user.uid;
        const result = this.cartItemService.addItemToCart(bookId, uId);
        return result;
    }

    @Patch('remove-item/:bookId')
    @UseGuards(AuthGuard)
    async removeItemToCart( @Param('bookId') bookId: number, @Request() req ) {
        const uId = req.user.uid;
        const result = this.cartItemService.removeItemToCart(bookId, uId);
        return result;
    }

    @Get('get-items')
    @UseGuards(AuthGuard)
    async getItemsFromCart( @Request() req ){
        const uId = req.user.uid;
        const result = this.cartItemService.getItemsFromCart(uId);
        return result;
    }

}