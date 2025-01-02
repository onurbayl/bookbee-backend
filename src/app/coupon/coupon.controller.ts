import { Body, Controller, Get, Post, Query, UseGuards, Request } from "@nestjs/common";
import { CouponService } from "./coupon.service";
import { createNewCouponDto } from "./dtos/create-new-coupon-dto";
import { AuthGuard } from "src/guards/auth.guard";
import { UserUnauthorizedException } from "../user/exceptions/user-unauthorized.exception";

@Controller('api/v1/coupon')
export class CouponController {
    constructor(private readonly couponService: CouponService) {}

    @Get('get-coupons')
    @UseGuards(AuthGuard)
    async getCouponsForUser( @Request() req ){
        const uId = req.user.uid;
        const result = await this.couponService.getCouponsForUser(uId);
        return result;
    }

    @Post('add-coupon')
    @UseGuards(AuthGuard)
    async addCouponToDatabase( @Body() inputData: createNewCouponDto, @Request() req ){
        if (req.user.role !== 'admin') {
            UserUnauthorizedException.byNotAdmin()
        }
        const result = await this.couponService.addCouponToDatabase(inputData);
        return result;
    }

}