import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CouponRepository } from "./coupon.repository";
import { Coupon } from "./coupon.entity";
import { UserRepository } from "../user/user.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { createNewCouponDto } from "./dtos/create-new-coupon-dto";
import { CouponInvalidDataException } from "./exceptions/coupon-invalid-data.exception";

@Injectable()
export class CouponService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(CouponRepository)
        private readonly couponRepository: CouponRepository,

        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
    ) {}

    async getCouponsForUser(userUId: string){

        const user = await this.userRepository.findByUId(userUId);
        if(user == null){
            UserNotFoundException.byUId();
        }

        const couponList: Coupon[] = await this.couponRepository.findActiveByUser(user.id);
        return couponList;
    }

    async addCouponToDatabase(inputData: createNewCouponDto){

        const discountPercentage = inputData.discountPercentage;
        const endDate = new Date(inputData.endDate);
        const userId = inputData.userId;
        
        const currentDate = new Date();
        
        if( discountPercentage == null || endDate == null || userId == null){
            CouponInvalidDataException.byMissingData(inputData);
        }

        const user = await this.userRepository.findById(userId);
        if( user == null ){
            UserNotFoundException.byId(userId);
        }

        if( endDate.getTime() <= currentDate.getTime() ){
            CouponInvalidDataException.byEndDate();
        }

        if( !( 5 <= discountPercentage && discountPercentage <= 100 ) ){
            CouponInvalidDataException.byDiscountPercentage(discountPercentage);
        }

        const newCoupon = new Coupon();
        newCoupon.user = user;
        newCoupon.discountPercentage = discountPercentage;
        newCoupon.startDate = currentDate;
        newCoupon.endDate = endDate;
        newCoupon.used = false;

        return this.couponRepository.save(newCoupon);
    }

}