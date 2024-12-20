import { Controller, UseGuards, Request, Get } from "@nestjs/common";
import { WishListService } from "./wish-list.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('api/v1/wishList')
export class WishListController {
    constructor(private readonly wishListService: WishListService) {}

    @Get('get-items')
    @UseGuards(AuthGuard)
    async getItemsForUser( @Request() req ){
        const uId = req.user.uid;
        console.log(uId);
        const result = this.wishListService.getItems(uId);
        return result;
    }
}