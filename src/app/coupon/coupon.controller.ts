import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CouponService } from "./coupon.service";
import { createNewCouponDto } from "./dtos/create-new-coupon-dto";

@Controller('api/v1/coupon')
export class CouponController {
    constructor(private readonly couponService: CouponService) {}

    @Get('get-coupons')
    async getCouponsForUser( @Query('u_id') userId: number = 0 ){
        const result = this.couponService.getCouponsForUser(userId);
        return result;
    }

    @Post('add-coupon')
    async addCouponToDatabase( @Body() inputData: createNewCouponDto ){
        const result = this.couponService.addCouponToDatabase(inputData);
        return result;
    }

}