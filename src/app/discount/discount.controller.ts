import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { DiscountService } from "./discount.service";
import { AuthGuard } from "src/guards/auth.guard";
import { UserUnauthorizedException } from "../user/exceptions/user-unauthorized.exception";
import { createNewDiscountDto } from "./dtos/create-new-discount-dto";

@Controller('api/v1/discount')
export class DiscountController {
    constructor(private readonly discountService: DiscountService) {}

    //Add api endpoints
    @Post('add-discount')
    @UseGuards(AuthGuard)
    async addDiscountToDatabase( @Body() inputData: createNewDiscountDto ,@Request() req ){
        if (req.user.role !== 'publisher') {
            UserUnauthorizedException.byNotPublisher()
        }
        const uId = req.user.uid;
        const result = await this.discountService.addDiscountToDatabase(inputData, uId);
        return result;
    }

}