import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Coupon } from "./coupon.entity";
import { CouponController } from "./coupon.controller";
import { CouponService } from "./coupon.service";
import { CouponRepository } from "./coupon.repository";
import { UserModule } from "../user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([Coupon]), UserModule],
    controllers: [CouponController],
    providers: [CouponService, CouponRepository],
    exports: [CouponRepository],
})
export class CouponModule {}