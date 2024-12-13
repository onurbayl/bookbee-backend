import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CouponRepository } from "./coupon.repository";
import { Coupon } from "./coupon.entity";
import { UserRepository } from "../user/user.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";

@Injectable()
export class CouponService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(CouponRepository)
        private readonly couponRepository: CouponRepository,

        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
    ) {}

    async getCouponsForUser(userId: number){

        const user = await this.userRepository.findById(userId);
        if( user == null ){
            UserNotFoundException.byId(userId);
        }

        const couponList: Coupon[] = await this.couponRepository.findActiveByUser(userId);
        return couponList;
    }

}