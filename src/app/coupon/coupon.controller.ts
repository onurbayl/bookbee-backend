import { Controller, Get, Query } from "@nestjs/common";
import { CouponService } from "./coupon.service";

@Controller('api/v1/coupon')
export class CouponController {
    constructor(private readonly couponService: CouponService) {}

    @Get('get-coupons')
    async getCouponsForUser( @Query('u_id') userId: number = 0 ){
        const result = this.couponService.getCouponsForUser(userId);
        return result;
    }

}