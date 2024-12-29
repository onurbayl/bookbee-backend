import { Controller, Get, UseGuards, Request, Param, Query } from "@nestjs/common";
import { OrderItemService } from "./order-item.service";
import { AuthGuard } from "src/guards/auth.guard";
import { UserUnauthorizedException } from "../user/exceptions/user-unauthorized.exception";

@Controller('api/v1/order-item')
export class OrderItemController {
    constructor(private readonly orderItemService: OrderItemService) {}

    @Get('get-book-data/:N')
    @UseGuards(AuthGuard)
    async findLastNSales( @Param('N') nDays: number, @Request() req ) {
        const uId = req.user.uid;
        if ( req.user.role != 'publisher' && req.user.role != 'admin') {
            UserUnauthorizedException.byNotPublisher();
        }
        const stats = await this.orderItemService.findLastNSales(uId, nDays);
        return stats;
    }
}