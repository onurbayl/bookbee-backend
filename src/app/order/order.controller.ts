import { Body, Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { AuthGuard } from "src/guards/auth.guard";
import { createNewOrderDto } from "./dtos/create-new-order-dto";
import { EmailService } from "src/mailer/email.service";

@Controller('api/v1/order')
export class OrderController {
    constructor(private readonly orderService: OrderService, private readonly emailService: EmailService) {}

    @Post('complete-purchase')
    @UseGuards(AuthGuard)
    async completePurchaseForUser( @Body() inputData: createNewOrderDto, @Request() req ) {
        const uId = req.user.uid;
        const result = await this.orderService.completePurchaseForUser(inputData, uId);
        const orderDetails = await this.orderService.getOrderHistoryDetails(result.id, uId);
        await this.emailService.sendOrderEmail(orderDetails);
        return result;
    }

    @Get('get-history')
    @UseGuards(AuthGuard)
    async getOrderHistory( @Request() req ) {
        const uId = req.user.uid;
        const result = await this.orderService.getOrderHistory(uId);
        return result;
    }

    @Get('get-history/:orderId')
    @UseGuards(AuthGuard)
    async getOrderHistoryDetails( @Param('orderId') orderId: number, @Request() req ) {
        const uId = req.user.uid;
        const result = await this.orderService.getOrderHistoryDetails(orderId, uId);
        return result;
    }

}