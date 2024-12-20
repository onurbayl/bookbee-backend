import { Controller, Param, UseGuards, Request, Get, Post } from "@nestjs/common";
import { WishListService } from "./wish-list.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('api/v1/wishList')
export class WishListController {
    constructor(private readonly wishListService: WishListService) {}

    @Post('add-item/:bookId')
    @UseGuards(AuthGuard)
    async addItemToWishList( @Param('bookId') bookId: number, @Request() req ) {
        const uId = req.user.uid;
        const result = this.wishListService.addItem(bookId, uId);
        return result;
    }

    @Get('get-items')
    @UseGuards(AuthGuard)
    async getItemsForUser( @Request() req ){
        const uId = req.user.uid;
        const result = this.wishListService.getItems(uId);
        return result;
    }
}