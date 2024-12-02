import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CouponRepository } from "./coupon.repository";

@Injectable()
export class CouponService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(CouponRepository)
        private readonly couponRepository: CouponRepository,
    ) {}

    //Add service methods

}