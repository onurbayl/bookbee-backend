import { HttpException, HttpStatus } from '@nestjs/common';
import { createNewDiscountDto } from '../dtos/create-new-discount-dto';

export class DiscountInvalidDataException extends HttpException {
  constructor(message: string = 'Invalid discount input data is given', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static byMissingData( inputData: createNewDiscountDto ) {
    var message = "Some input data is missing in discount form. Missing: ";

    if(inputData.discountPercentage == null){
      message = message + "discount percentage, ";
    }

    if(inputData.startDate == null){
      message = message + "start date, ";
    }

    if(inputData.endDate == null){
      message = message + "end date, ";
    }

    if(inputData.bookId == null){
      message = message + "book ID, ";
    }

    throw new DiscountInvalidDataException(message, HttpStatus.BAD_REQUEST)
  }

  static byDiscountPercentage( discountPercentage: number ) {
    throw new DiscountInvalidDataException(`In discount, the discount percentage should be between 5 to 100, given value: ${discountPercentage}`, HttpStatus.BAD_REQUEST)
  }

  static byStartDate() {
    throw new DiscountInvalidDataException(`In discount, the start date should not be in the past`, HttpStatus.BAD_REQUEST)
  }

  static byEndDate() {
    throw new DiscountInvalidDataException(`In discount, the end date should not be in the past`, HttpStatus.BAD_REQUEST)
  }

  static byDateOrder() {
    throw new DiscountInvalidDataException(`In discount, the end date should not be before the start date`, HttpStatus.BAD_REQUEST)
  }

  static byOverlappingDiscount() {
    throw new DiscountInvalidDataException(`The new discount overlaps with a existing one.`, HttpStatus.BAD_REQUEST)
  }

}