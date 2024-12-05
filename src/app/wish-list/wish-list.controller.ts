import { Controller } from "@nestjs/common";
import { WishListService } from "./wish-list.service";

@Controller('api/v1/wishList')
export class WishListController {
    constructor(private readonly wishListService: WishListService) {}

    //Add api endpoints

}