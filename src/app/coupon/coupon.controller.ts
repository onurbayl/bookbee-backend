import { Controller } from "@nestjs/common";
import { CouponService } from "./coupon.service";

@Controller('api/v1/coupon')
export class CouponController {
    constructor(private readonly couponService: CouponService) {}

    //Add api endpoints

}