import { HttpException, HttpStatus } from '@nestjs/common';
import { createNewCouponDto } from '../dtos/create-new-coupon-dto';

export class CouponInvalidDataException extends HttpException {
  constructor(message: string = 'Invalid coupon input data is given', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static byMissingData( inputData: createNewCouponDto ) {
    var message = "Some input data is missing in coupon form. Missing: ";

    if(inputData.discountPercentage == null){
        message = message + "discount percentage, ";
    }

    if(inputData.endDate == null){
        message = message + "end date, ";
    }

    if(inputData.userId == null){
        message = message + "user ID, ";
    }

    throw new CouponInvalidDataException(message, HttpStatus.BAD_REQUEST)
  }

  static byDiscountPercentage( discountPercentage: number ) {
    throw new CouponInvalidDataException(`In coupon, the discount percentage should be between 5 to 100, given value: ${discountPercentage}`, HttpStatus.BAD_REQUEST)
  }

  static byEndDate() {
    throw new CouponInvalidDataException(`In coupon, the end date should not be in the past`, HttpStatus.BAD_REQUEST)
  }

  static byInvalidCoupon( cId: number) {
    throw new CouponInvalidDataException(`This coupon with id ${cId} is already used or expired.`, HttpStatus.BAD_REQUEST)
  }

  static byWrongUser() {
    throw new CouponInvalidDataException(`This user does not own this coupon.`, HttpStatus.BAD_REQUEST)
  }

}