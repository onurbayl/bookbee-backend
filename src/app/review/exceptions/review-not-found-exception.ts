import { HttpException, HttpStatus } from '@nestjs/common';

export class ReviewNotFoundException extends HttpException {
  constructor(message: string = 'Review not found', statusCode: HttpStatus) {
    super(message, statusCode);
  }
  
  static byId( reviewId: number ) {
    throw new ReviewNotFoundException(`Review for ID ${reviewId} not found`, HttpStatus.NOT_FOUND)
  }

}