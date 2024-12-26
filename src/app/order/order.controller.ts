import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { AuthGuard } from "src/guards/auth.guard";
import { createNewOrderDto } from "./dtos/create-new-order-dto";

@Controller('api/v1/order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post('complete-purchase')
    @UseGuards(AuthGuard)
    async completePurchaseForUser( @Body() inputData: createNewOrderDto, @Request() req ) {
        const uId = req.user.uid;
        const result = this.orderService.completePurchaseForUser(inputData, uId);
        return result;
    }

    @Get('get-history')
    @UseGuards(AuthGuard)
    async getOrderHistory( @Request() req ) {
        const uId = req.user.uid;
        const result = this.orderService.getOrderHistory(uId);
        return result;
    }

}